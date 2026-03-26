import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { assamDistricts, services } from '../data/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import ProfileForm from '../components/ProfileForm';
import { Search, Calendar, Clock, Star, MapPin } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { providers, bookings, addBooking } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'profile'>('search');
  
  // Search state
  const queryParams = new URLSearchParams(location.search);
  const [searchService, setSearchService] = useState(queryParams.get('service') || '');
  const [searchDistrict, setSearchDistrict] = useState(queryParams.get('district') || '');
  
  // Booking Modal State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Redirect if not customer
  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'customer') navigate(`/${user.role}/dashboard`);
  }, [user, navigate]);

  const filteredProviders = providers.filter(p => {
    let match = true;
    if (searchService && p.service !== searchService) match = false;
    if (searchDistrict && p.district !== searchDistrict) match = false;
    return match;
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProvider) return;

    try {
      await addBooking({
        customerId: user.id,
        providerId: selectedProvider.id,
        service: selectedProvider.service,
        date: bookingDate,
        time: bookingTime,
        price: selectedProvider.pricePerHour
      });

      setSelectedProvider(null);
      setBookingDate('');
      setBookingTime('');
      setActiveTab('bookings');
    } catch (err) {
      // Handled in context
    }
  };

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || id;
  const getDistrictName = (id: string) => assamDistricts.find(d => d.value === id)?.label || id;
  const getProviderName = (idOrObj: any) => {
    if (typeof idOrObj === 'object' && idOrObj?.name) return idOrObj.name;
    return providers.find(p => p.id === idOrObj)?.name || String(idOrObj);
  };

  const myBookings = bookings.filter(b => {
    const cId = typeof b.customerId === 'object' ? b.customerId?._id : b.customerId;
    return cId === user?.id;
  });

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar - Premium Minimalist */}
      <aside style={{ width: '280px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem', paddingLeft: '0.75rem' }}>
           <p className="text-muted text-sm font-medium" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</p>
           <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>{user.name}</h3>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('search')}
            style={{ 
              textAlign: 'left', 
              padding: '1rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: activeTab === 'search' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'search' ? 'white' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'search' ? 600 : 500,
              transition: 'all var(--transition-fast)'
            }}
          >
            Find Services
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{ 
              textAlign: 'left', 
              padding: '1rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: activeTab === 'bookings' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'bookings' ? 'white' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'bookings' ? 600 : 500,
              transition: 'all var(--transition-fast)'
            }}
          >
            My Bookings
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              textAlign: 'left', 
              padding: '1rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'profile' ? 'white' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'profile' ? 600 : 500,
              transition: 'all var(--transition-fast)'
            }}
          >
            Profile Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', backgroundColor: 'var(--color-background)' }}>
        {activeTab === 'search' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Find Professionals</h2>
              <p className="text-muted text-lg mt-1">Book trusted experts across Assam.</p>
            </div>
            
            <Card style={{ flexDirection: 'row', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3rem', padding: '2rem', boxShadow: 'var(--shadow-md)', border: 'none' }}>
              <div style={{ flex: 1 }}>
                <Select 
                  label="Service Required" 
                  options={services.map(s => ({ label: s.name, value: s.id }))} 
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Select 
                  label="Location (District)" 
                  options={assamDistricts} 
                  value={searchDistrict}
                  onChange={(e) => setSearchDistrict(e.target.value)}
                />
              </div>
              <Button size="lg" style={{ height: '52px' }}>
                <Search size={20} style={{ marginRight: '0.75rem' }} /> Search
              </Button>
            </Card>

            <h3 className="mb-6 text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>Available Experts ({filteredProviders.length})</h3>
            {filteredProviders.length === 0 ? (
              <div className="text-center text-muted" style={{ padding: '4rem 2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
                <Search size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem auto' }} />
                <p className="text-lg">No professionals found matching your criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {filteredProviders.map(p => (
                  <Card key={p.id} className="card-hover" style={{ padding: '2.5rem 2rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', color: 'var(--color-primary)' }}>{p.name}</h4>
                        <span className="text-sm font-medium" style={{ display: 'inline-block', color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-subtle)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>{getServiceName(p.service)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--color-warning-bg)', color: '#B45309', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 700 }}>
                        <Star size={14} fill="currentColor" /> {p.rating}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <MapPin size={18} /> {getDistrictName(p.district)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <Clock size={18} /> <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>₹{p.pricePerHour}</span> / hour
                      </div>
                    </div>
                    
                    <Button fullWidth size="lg" onClick={() => setSelectedProvider(p)}>Book Now</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}>My Bookings</h2>
              <p className="text-muted text-lg mt-1">Track and manage your upcoming services.</p>
            </div>
            
            {myBookings.length === 0 ? (
              <div className="text-center text-muted" style={{ padding: '4rem 2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
                <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem auto' }} />
                <p className="mb-6 text-lg">You haven't booked any services yet.</p>
                <Button size="lg" onClick={() => setActiveTab('search')}>Find an Expert</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {myBookings.map(b => {
                  const statusColors = {
                    pending: { bg: 'var(--color-warning-bg)', text: '#B45309' },
                    accepted: { bg: '#DBEAFE', text: '#1E40AF' },
                    completed: { bg: 'var(--color-success-bg)', text: 'var(--color-success)' },
                    rejected: { bg: 'var(--color-error-bg)', text: 'var(--color-error)' },
                    cancelled: { bg: 'var(--color-error-bg)', text: 'var(--color-error)' }
                  };
                  const colorConfig = statusColors[b.status];

                  return (
                    <Card key={b.id} className="card-hover" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '2.5rem', border: '1px solid var(--color-border)' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.375rem', color: 'var(--color-primary)' }}>{getServiceName(b.service)}</h4>
                        <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{getProviderName(b.providerId)}</span>
                          <span style={{ color: 'var(--color-border-hover)' }}>|</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={18} /> {b.date}</span>
                          <span style={{ color: 'var(--color-border-hover)' }}>|</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={18} /> {b.time}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>STATUS</div>
                          <div style={{ 
                            fontWeight: 800, 
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                            padding: '0.375rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: colorConfig.bg,
                            color: colorConfig.text
                          }}>
                            {b.status}
                          </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{b.price}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Profile Settings</h2>
              <p className="text-muted text-lg mt-1">Update your personal information.</p>
            </div>
            
            <Card style={{ padding: '2.5rem', border: '1px solid var(--color-border)' }}>
              <ProfileForm user={user} updateProfile={updateProfile} />
            </Card>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <Modal isOpen={!!selectedProvider} onClose={() => setSelectedProvider(null)} title="Book Service">
        {selectedProvider && (
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: 'var(--color-primary)' }}>{selectedProvider.name}</h4>
              <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{getServiceName(selectedProvider.service)}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>₹{selectedProvider.pricePerHour}/hr</span>
              </div>
            </div>

            <Input 
              label="Select Date" 
              type="date" 
              required 
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            
            <Select 
              label="Select Time Slot" 
              options={[
                { label: 'Morning (9 AM - 12 PM)', value: 'Morning' },
                { label: 'Afternoon (12 PM - 4 PM)', value: 'Afternoon' },
                { label: 'Evening (4 PM - 7 PM)', value: 'Evening' },
              ]}
              required
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />

            <div>
              <p className="text-sm" style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Payment Method</p>
              <div style={{ padding: '1rem', border: '2px solid var(--color-border-hover)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="radio" checked readOnly style={{ accentColor: 'var(--color-primary)', width: '1.25rem', height: '1.25rem' }} />
                <span className="font-medium" style={{ fontSize: '1rem' }}>Pay with Cash / UPI after service</span>
              </div>
            </div>

            <Button type="submit" size="xl" fullWidth style={{ marginTop: '0.5rem' }}>Confirm Booking</Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
