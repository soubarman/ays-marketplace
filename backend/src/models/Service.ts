import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  serviceId: string;
  name: string;
  description?: string;
}

const ServiceSchema: Schema = new Schema({
  serviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IService>('Service', ServiceSchema);
