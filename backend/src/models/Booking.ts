import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'rejected';
  date: string;
  time: string;
  price: number;
}

const BookingSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled', 'rejected'], default: 'pending' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
