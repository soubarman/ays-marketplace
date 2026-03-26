import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from './AuthContext';

export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled';

export interface Booking {
  id?: string;
  _id?: string;
  customerId: string | any;
  providerId: string | any;
  service: string;
  serviceId?: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
}

interface AppContextType {
  providers: any[];
  bookings: Booking[];
  fetchProviders: (service?: string, district?: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => Promise<any>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchProviders = async (service = '', district = '') => {
    try {
      const qs = new URLSearchParams();
      if (service) qs.append('service', service);
      if (district) qs.append('district', district);
      const data = await apiClient(`/users/providers?${qs.toString()}`);
      const formatted = data.map((p: any) => ({ ...p, id: p._id }));
      setProviders(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await apiClient('/bookings');
      // Format data to match old frontend interface
      const formatted = data.map((b: any) => ({
        ...b,
        id: b._id,
        service: b.serviceId,
      }));
      setBookings(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'status'>) => {
    try {
      const newBooking = await apiClient('/bookings', { body: bookingData });
      setBookings(prev => [...prev, { ...newBooking, id: newBooking._id, service: newBooking.serviceId }]);
      return newBooking; // return for success confirmation
    } catch (err: any) {
      console.error(err);
      alert('Error booking service: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const updatedBooking = await apiClient(`/bookings/${id}/status`, { method: 'PUT', body: { status } });
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: updatedBooking.status } : b)));
    } catch (err: any) {
      console.error(err);
      alert('Error updating status: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <AppContext.Provider value={{ providers, bookings, fetchProviders, fetchBookings, addBooking, updateBookingStatus }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
