import { NextRequest } from 'next/server';
import { createHash, createPublicKey, verify } from 'crypto';
import { connectToDatabase } from '@/lib/db';
import { Device } from '@/models/device';


const toOrigin = (value: string | undefined | null) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const DEV_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const getAllowedOrigins = () => {
  const envOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);

  const origins =
    process.env.NODE_ENV === "production"
      ? envOrigins
      : [...envOrigins, ...DEV_ALLOWED_ORIGINS];

  return new Set(origins);
};

export const isAllowedWebOrigin = (req: NextRequest) => {
  const origin = toOrigin(req.headers.get("origin"));
  const referer = toOrigin(req.headers.get("referer"));
  const allowed = getAllowedOrigins();

  return (
    (origin && allowed.has(origin)) ||
    (referer && allowed.has(referer))
  );
};

const isSameOriginAsHost = (req: NextRequest) => {
  const host = req.headers.get("host");
  if (!host) return false;

  // Allow localhost in dev
  if (process.env.NODE_ENV !== "production") {
    const origin = toOrigin(req.headers.get("origin"));
    const referer = toOrigin(req.headers.get("referer"));
    return (
      origin === `http://${host}` ||
      origin === `https://${host}` ||
      referer === `http://${host}` ||
      referer === `https://${host}`
    );
  }

  // In prod, require https
  const expected = `https://${host}`;
  const origin = toOrigin(req.headers.get("origin"));
  const referer = toOrigin(req.headers.get("referer"));
  return origin === expected || referer === expected;
};

const getDeviceHeaders = (req: NextRequest) => {
  return {
    deviceId: req.headers.get('x-ptm3-device-id'),
    timestamp: req.headers.get('x-ptm3-timestamp'),
    signature: req.headers.get('x-ptm3-signature'),
  };
};

const hashBody = (bodyText: string) =>
  createHash('sha256').update(bodyText).digest('hex');

const buildSignaturePayload = (params: {
  method: string;
  path: string;
  timestamp: string;
  bodyHash: string;
}) =>
  [params.method, params.path, params.timestamp, params.bodyHash].join('\n');

export const verifyDeviceRequest = async (
  req: NextRequest,
  bodyText: string,
) => {
  const { deviceId, timestamp, signature } = getDeviceHeaders(req);
  if (!deviceId || !timestamp || !signature) return false;

  const ts = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > 300) return false; // 5 minutes skew

  await connectToDatabase();
  const device = await Device.findOne({ deviceId });
  if (!device) return false;

  const path = req.nextUrl.pathname + req.nextUrl.search;
  const bodyHash = hashBody(bodyText);
  const payload = buildSignaturePayload({
    method: req.method.toUpperCase(),
    path,
    timestamp,
    bodyHash,
  });

  try {
    const publicKey = createPublicKey(device.publicKey);
    const ok = verify(null, Buffer.from(payload), publicKey, Buffer.from(signature, 'base64'));
    if (ok) {
      device.lastSeen = new Date();
      await device.save();
    }
    return ok;
  } catch {
    return false;
  }
};

export const ensureAuthorizedRequest = async (req: NextRequest, bodyText: string) => {
  if (isSameOriginAsHost(req) || isAllowedWebOrigin(req)) {
    return { ok: true };
  }

  const deviceOk = await verifyDeviceRequest(req, bodyText);
  if (deviceOk) return { ok: true };

  return { ok: false, status: 401, error: "Unauthorized" };
};

export const verifyDeviceRegistration = async (payload: {
  deviceId: string;
  publicKey: string;
  signature: string;
  timestamp: number;
}) => {
  const { deviceId, publicKey, signature, timestamp } = payload;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) return false;

  const canonical = ['REGISTER', deviceId, `${timestamp}`].join('\n');
  try {
    const key = createPublicKey(publicKey);
    return verify(
      null,
      Buffer.from(canonical),
      key,
      Buffer.from(signature, 'base64'),
    );
  } catch {
    return false;
  }
};
