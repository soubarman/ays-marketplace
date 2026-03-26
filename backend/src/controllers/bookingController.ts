import { Request, Response } from 'express';
import Booking from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  const { providerId, service: serviceId, date, time, price } = req.body;
  
  try {
    const booking = await Booking.create({
      customerId: (req as any).user.id,
      providerId,
      serviceId,
      date,
      time,
      price,
      status: 'pending'
    });
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;
    
    // If customer, find where customerId matches. If provider, find where providerId matches.
    const filter = role === 'provider' ? { providerId: userId } : { customerId: userId };
    
    const bookings = await Booking.find(filter)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone service pricePerHour')
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Add verification logic to ensure only the assigned provider can accept/complete
    
    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
