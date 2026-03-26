import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext, type BookingStatus } from '../context/AppContext';
import { services } from '../data/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import ProfileForm from '../components/ProfileForm';
import { CheckCircle, XCircle, Clock, Calendar, DollarSign, Star, Briefcase } from 'lucide-react';

const ProviderDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { bookings, updateBookingStatus } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'profile'>('requests');

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'provider') navigate(`/${user.role}/dashboard`);
  }, [user, navigate]);

  const getProviderId = (idOrObj: any) => typeof idOrObj === 'object' ? idOrObj?._id : idOrObj;
  
  const providerBookings = bookings.filter(b => getProviderId(b.providerId) === user?.id);
  const incomingRequests = providerBookings.filter(b => b.status === 'pending');
  const activeJobs = providerBookings.filter(b => b.status === 'accepted');
  const pastJobs = providerBookings.filter(b => b.status === 'completed');
  const totalEarnings = pastJobs.reduce((acc, job) => acc + job.price, 0);
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || id;

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar - Premium Minimalist */}
      <aside style={{ width: '280px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem', paddingLeft: '0.75rem' }}>
           <p className="text-muted text-sm font-medium" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider Portal</p>
           <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '0.25rem', fontWeight: 800 }}>{user.name}</h3>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={() => setActiveTab('requests')}
            style={{ textAlign: 'left', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'requests' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'requests' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'requests' ? 600 : 500, transition: 'all var(--transition-fast)' }}
          >
            Job Requests
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            style={{ textAlign: 'left', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'earnings' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'earnings' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'earnings' ? 600 : 500, transition: 'all var(--transition-fast)' }}
          >
            Earnings & Stats
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ textAlign: 'left', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'profile' ? 600 : 500, transition: 'all var(--transition-fast)' }}
          >
            Profile Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', backgroundColor: 'var(--color-background)' }}>
        {activeTab === 'requests' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Job Requests</h2>
              <p className="text-muted text-lg mt-1">Manage your incoming leads and active tasks.</p>
            </div>
            
            <div style={{ display: 'grid', gap: '3.5rem' }}>
              <div>
                <h3 className="text-xl mb-4 font-bold" style={{ color: 'var(--color-primary)' }}>New Opportunities ({incomingRequests.length})</h3>
                {incomingRequests.length === 0 ? (
                  <div className="text-center text-muted" style={{ padding: '4.5rem 2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
                    <Briefcase size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem auto' }} />
                    <p className="text-lg">No new job leads right now. We'll notify you when a customer requests your service.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {incomingRequests.map(req => (
                      <Card key={req.id} style={{ padding: '2.5rem', border: '1px solid var(--color-border)' }} className="card-hover">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--color-primary)' }}>{getServiceName(req.service)} Lead</h4>
                            <div style={{ color: 'var(--color-text-main)', marginBottom: '1rem', fontSize: '1.125rem' }}>
                              <span style={{ fontWeight: 600 }}>Customer:</span> {typeof req.customerId === 'object' ? req.customerId?.name : 'Unknown User'}
                              {typeof req.customerId === 'object' && req.customerId?.phone && (
                                <span style={{ color: 'var(--color-text-muted)' }}> | {req.customerId.phone}</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={18} /> {req.date}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={18} /> {req.time}</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>₹{req.price}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Button size="lg" onClick={() => handleStatusChange(req.id as string, 'accepted')} style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)', minWidth: '160px' }}>
                              <CheckCircle size={18} style={{ marginRight: '0.375rem' }} /> Accept Lead
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleStatusChange(req.id as string, 'rejected')} style={{ color: 'var(--color-error)', minWidth: '160px', borderColor: 'transparent', backgroundColor: 'var(--color-error-bg)' }}>
                              <XCircle size={18} style={{ marginRight: '0.375rem' }} /> Decline
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl mb-4 font-bold" style={{ color: 'var(--color-primary)' }}>Active Jobs ({activeJobs.length})</h3>
                {activeJobs.length === 0 ? (
                  <p className="text-muted text-lg">No ongoing jobs.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {activeJobs.map(job => (
                      <Card key={job.id} style={{ borderLeft: '6px solid var(--color-accent)', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.375rem' }}>{getServiceName(job.service)}</h4>
                            <div style={{ color: 'var(--color-text-main)', marginBottom: '0.75rem', fontSize: '1.125rem' }}>
                              <span style={{ fontWeight: 600 }}>Customer:</span> {typeof job.customerId === 'object' ? job.customerId?.name : 'Unknown User'}
                              {typeof job.customerId === 'object' && job.customerId?.phone && (
                                <span style={{ color: 'var(--color-text-muted)' }}> | {job.customerId.phone}</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={18} /> {job.date}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={18} /> {job.time}</span>
                            </div>
                          </div>
                          <Button size="lg" onClick={() => handleStatusChange(job.id as string, 'completed')}>Mark Completed</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Earnings Overview</h2>
              <p className="text-muted text-lg mt-1">Track your financial performance and stats.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              <Card style={{ padding: '3rem', border: '1px solid var(--color-success-bg)', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }}>
                  <DollarSign size={36} color="var(--color-success)" />
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>₹{totalEarnings}</div>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '1.125rem' }}>Total Earnings</div>
              </Card>
              
              <Card style={{ padding: '3rem', border: '1px solid var(--color-accent-subtle)', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: 'var(--color-accent-subtle)', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }}>
                  <CheckCircle size={36} color="var(--color-accent)" />
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{pastJobs.length}</div>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '1.125rem' }}>Jobs Completed</div>
              </Card>

              <Card style={{ padding: '3rem', border: '1px solid var(--color-warning-bg)', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: 'var(--color-warning-bg)', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }}>
                  <Star size={36} color="#F59E0B" />
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>4.8</div>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '1.125rem' }}>Average Rating</div>
              </Card>
            </div>

            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Recent Payout History</h3>
            <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
               {pastJobs.length === 0 ? (
                 <p className="text-muted text-center text-lg" style={{ padding: '4rem' }}>No completed jobs yet for payout.</p>
               ) : (
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead style={{ backgroundColor: 'var(--color-background)' }}>
                     <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                       <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Date Completed</th>
                       <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Service Category</th>
                       <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Payout Amount</th>
                     </tr>
                   </thead>
                   <tbody>
                     {pastJobs.map((job, idx) => (
                       <tr key={job.id} style={{ borderBottom: idx === pastJobs.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-background)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                         <td style={{ padding: '1.5rem 2rem', fontSize: '1.125rem' }}>{job.date}</td>
                         <td style={{ padding: '1.5rem 2rem', fontSize: '1.125rem', fontWeight: 500 }}>{getServiceName(job.service)}</td>
                         <td style={{ padding: '1.5rem 2rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)', textAlign: 'right' }}>₹{job.price}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Profile Settings</h2>
              <p className="text-muted text-lg mt-1">Manage your active details and rates.</p>
            </div>
            
            <Card style={{ padding: '2.5rem', border: '1px solid var(--color-border)' }}>
              <ProfileForm user={user} updateProfile={updateProfile} />
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboard;
