import { NextRequest } from 'next/server';
import { createHash, createPublicKey, verify } from 'crypto';
import { connectToDatabase } from '@/lib/db';
import { Device } from '@/models/device';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://podcasttomp3.com',
  'https://www.podcasttomp3.com',
];

const LOCAL_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const toOrigin = (value: string | undefined | null) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [];
  const extraOrigins = [
    toOrigin(process.env.NEXT_PUBLIC_SITE_URL),
    toOrigin(process.env.NEXT_PUBLIC_APP_URL),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean) as string[];
  const allowLocalhost =
    process.env.ALLOW_LOCALHOST_ORIGIN === '1' ||
    process.env.NODE_ENV !== 'production';
  const originList = [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...extraOrigins,
    ...envOrigins,
    ...(allowLocalhost ? LOCAL_ALLOWED_ORIGINS : []),
  ];

  return [...new Set(originList)].filter(Boolean);
};

const originMatches = (value: string | null) => {
  if (!value) return false;
  try {
    const origin = new URL(value).origin;
    return getAllowedOrigins().includes(origin);
  } catch {
    return false;
  }
};

export const isAllowedWebOrigin = (req: NextRequest) => {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  if (originMatches(origin)) return true;
  if (originMatches(referer)) return true;
  return false;
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

export const ensureAuthorizedRequest = async (
  req: NextRequest,
  bodyText: string,
) => {
  if (isAllowedWebOrigin(req)) {
    return { ok: true };
  }

  const deviceOk = await verifyDeviceRequest(req, bodyText);
  if (deviceOk) {
    return { ok: true };
  }

  return { ok: false, status: 401, error: 'Unauthorized' };
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
