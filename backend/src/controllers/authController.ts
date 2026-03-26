import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, district, pincode, service, pricePerHour } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role, phone, district, pincode, service, pricePerHour
    });

    res.status(201).json({
      _id: user.id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, district: user.district, pincode: user.pincode,
      service: user.service, pricePerHour: user.pricePerHour,
      token: generateToken(user.id)
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password as string))) {
      res.json({
        _id: user.id, name: user.name, email: user.email, role: user.role,
        phone: user.phone, district: user.district, pincode: user.pincode,
        service: user.service, pricePerHour: user.pricePerHour,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json((req as any).user);
};
