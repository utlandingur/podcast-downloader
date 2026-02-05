import mongoose, { Schema, type Document } from 'mongoose';

export interface DeviceDocument extends Document {
  deviceId: string;
  publicKey: string;
  createdAt: Date;
  lastSeen: Date;
}

const DeviceSchema = new Schema<DeviceDocument>({
  deviceId: { type: String, required: true, unique: true, index: true },
  publicKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
});

export const Device =
  (mongoose.models.Device as mongoose.Model<DeviceDocument>) ||
  mongoose.model<DeviceDocument>('Device', DeviceSchema);
