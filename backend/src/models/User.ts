import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'provider' | 'admin';
  phone?: string;
  district?: string;
  pincode?: string;
  // Provider specific
  service?: string;
  rating?: number;
  jobsCompleted?: number;
  pricePerHour?: number;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  phone: { type: String },
  district: { type: String },
  pincode: { type: String },
  service: { type: String },
  rating: { type: Number, default: 0 },
  jobsCompleted: { type: Number, default: 0 },
  pricePerHour: { type: Number }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
