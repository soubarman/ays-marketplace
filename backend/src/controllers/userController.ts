import { Request, Response } from 'express';
import User from '../models/User';

// Get providers by service or district
export const getProviders = async (req: Request, res: Response) => {
  const { service, district } = req.query;
  const filter: any = { role: 'provider' };
  
  if (service) filter.service = service;
  if (district && district !== 'all') filter.district = district;

  try {
    const providers = await User.find(filter).select('-password');
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const updateData: any = {};
    
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.district !== undefined) updateData.district = req.body.district;
    if (req.body.pincode !== undefined) updateData.pincode = req.body.pincode;
    
    if ((req as any).user.role === 'provider') {
      if (req.body.service !== undefined) updateData.service = req.body.service;
      if (req.body.pricePerHour !== undefined) updateData.pricePerHour = req.body.pricePerHour;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      district: updatedUser.district,
      pincode: updatedUser.pincode,
      service: updatedUser.service,
      pricePerHour: updatedUser.pricePerHour
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
