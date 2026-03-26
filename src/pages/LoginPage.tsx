import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import { services, assamDistricts } from '../data/mockData';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [service, setService] = useState('');
  const [district, setDistrict] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
      setRole('provider');
    }
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      if (isLogin) {
        await login(role, email, password);
      } else {
        if (!name || !phone || !district || !pincode) {
          alert('Please fill out all common details (Name, Phone, District, Pincode).');
          return;
        }
        if (role === 'provider' && (!service || !pricePerHour)) {
          alert('Please fill out all provider details (Service Category, Price Per Hour).');
          return;
        }
        await register({ role, email, password, name, phone, pincode, service, district, pricePerHour: Number(pricePerHour) });
      }
      
      if (role === 'customer') navigate('/customer/dashboard');
      else if (role === 'provider') navigate('/provider/dashboard');
      else navigate('/admin/dashboard');
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    }
  };

  return (
    <div className="bg-gradient-mesh" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
      <Link to="/" className="hover-accent lg-ml-8" style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}>
        ← Back to Home
      </Link>
      <div className="card glass lg-p-12" style={{ width: '100%', maxWidth: '480px', padding: '2rem 1.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1.25rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            AYS PORTAL
          </div>
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 800 }} className="lg-text-3xl">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-muted text-lg">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Join AYS to get started today.'}
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'rgba(15,23,42,0.05)', padding: '0.375rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <button 
            style={{ 
              flex: 1, 
              padding: '0.875rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: role === 'customer' ? 'var(--color-surface)' : 'transparent',
              boxShadow: role === 'customer' ? 'var(--shadow-md)' : 'none',
              fontWeight: role === 'customer' ? 700 : 500,
              fontSize: '1rem',
              color: role === 'customer' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => setRole('customer')}
            type="button"
          >
            Customer
          </button>
          <button 
            style={{ 
              flex: 1, 
              padding: '0.875rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: role === 'provider' ? 'var(--color-surface)' : 'transparent',
              boxShadow: role === 'provider' ? 'var(--shadow-md)' : 'none',
              fontWeight: role === 'provider' ? 700 : 500,
              fontSize: '1rem',
              color: role === 'provider' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => setRole('provider')}
            type="button"
          >
            Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <>
              <Input 
                label="Full Name" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={role === 'customer' ? 'e.g. John Doe' : 'e.g. AYS Electricals'} 
                required 
              />
              <Input 
                label="Phone Number" 
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210" 
                required 
              />
              <Select 
                label="Operating District / Location" 
                options={[ { label: 'Select District', value: '' }, ...assamDistricts ]} 
                value={district}
                onChange={e => setDistrict(e.target.value)}
                required
              />
              <Input 
                label="Pincode" 
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="e.g. 781001" 
                required 
              />
            </>
          )}
          
          {!isLogin && role === 'provider' && (
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
                placeholder="e.g. 500" 
                value={pricePerHour}
                onChange={e => setPricePerHour(e.target.value)}
                required 
              />
            </>
          )}

          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />

          <Button type="submit" size="lg" fullWidth className="lg-size-xl" style={{ marginTop: '1rem' }}>
            {isLogin ? 'Sign In Securely' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center" style={{ marginTop: '2.5rem', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--color-accent)', fontWeight: 700, marginLeft: '0.25rem', fontSize: '1rem' }}
            type="button"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
