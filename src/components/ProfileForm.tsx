import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Select from './Select';
import { services, assamDistricts } from '../data/mockData';
import { apiClient } from '../api/client';

const ProfileForm = ({ user, updateProfile }: { user: any, updateProfile: any }) => {
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [district, setDistrict] = useState(user.district || '');
  const [pincode, setPincode] = useState(user.pincode || '');
  const [service, setService] = useState(user.service || '');
  const [pricePerHour, setPricePerHour] = useState(user.pricePerHour || '');
  
  React.useEffect(() => {
    const syncProfileRaw = async () => {
      try {
        const rawDbUser = await apiClient('/auth/me');
        if (rawDbUser) {
          setName(rawDbUser.name || '');
          setPhone(rawDbUser.phone || '');
          setDistrict(rawDbUser.district || '');
          setPincode(rawDbUser.pincode || '');
          if (rawDbUser.role === 'provider') {
            setService(rawDbUser.service || '');
            setPricePerHour(rawDbUser.pricePerHour || '');
          }
        }
      } catch (err) {}
    };
    syncProfileRaw();
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, phone, district, pincode, service, pricePerHour: Number(pricePerHour) });
      
      const rawDbUser = await apiClient('/auth/me');
      if (rawDbUser) {
          setPhone(rawDbUser.phone || '');
          setDistrict(rawDbUser.district || '');
          setPincode(rawDbUser.pincode || '');
      }
      
      alert("Profile updated successfully!");
    } catch(err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
      
      <Select 
        label="District / Location" 
        options={[ { label: 'Select District', value: '' }, ...assamDistricts ]} 
        value={district}
        onChange={e => setDistrict(e.target.value)}
      />
      
      <Input label="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} />

      {user.role === 'provider' && (
        <>
          <Select 
            label="Service Category" 
            options={[ { label: 'Select Service', value: '' }, ...services.map(s => ({ label: s.name, value: s.id })) ]} 
            value={service}
            onChange={e => setService(e.target.value)}
            required
          />
          <Input 
            label="Price Per Hour (₹)" 
            type="number"
            value={pricePerHour}
            onChange={e => setPricePerHour(e.target.value)}
            required 
          />
        </>
      )}

      <Button type="submit" size="lg" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</Button>
    </form>
  );
};

export default ProfileForm;
