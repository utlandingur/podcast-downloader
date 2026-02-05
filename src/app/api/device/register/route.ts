import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Device } from '@/models/device';
import { verifyDeviceRegistration } from '@/lib/deviceAuth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const deviceId = body?.deviceId;
  const publicKey = body?.publicKey;
  const signature = body?.signature;
  const timestamp = body?.timestamp;

  if (!deviceId || !publicKey || !signature || !timestamp) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const ok = await verifyDeviceRegistration({
    deviceId,
    publicKey,
    signature,
    timestamp: Number(timestamp),
  });

  if (!ok) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  await connectToDatabase();
  await Device.findOneAndUpdate(
    { deviceId },
    { publicKey, lastSeen: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return NextResponse.json({ ok: true });
}
