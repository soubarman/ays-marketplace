import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Users, Activity, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { providers, bookings } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'providers'>('overview');

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'admin') navigate(`/${user.role}/dashboard`);
  }, [user, navigate]);

  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.price, 0);
  const platformCommission = totalRevenue * 0.1;

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar / Top Nav for Mobile */}
      <aside className="lg-block" style={{ 
        width: '100%', 
        backgroundColor: 'var(--color-primary)', 
        borderBottom: '1px solid var(--color-primary-light)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        position: 'sticky',
        top: '80px',
        zIndex: 90,
      }}>
        <nav style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.25rem' }}>
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'providers', label: 'Manage Providers' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{ 
                whiteSpace: 'nowrap',
                padding: '0.75rem 1.25rem', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9375rem',
                transition: 'all var(--transition-fast)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 1rem', backgroundColor: 'var(--color-background)' }}>
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Platform Analytics</h2>
              <p className="text-muted text-lg mt-1">Real-time health numbers for AYS network.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
              <Card style={{ padding: '3rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#DBEAFE', color: '#1D4ED8', borderRadius: 'var(--radius-xl)' }}>
                    <Activity size={28} />
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Total Bookings</div>
                </div>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>{bookings.length}</div>
              </Card>

              <Card style={{ padding: '3rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#D1FAE5', color: '#047857', borderRadius: 'var(--radius-xl)' }}>
                    <DollarSign size={28} />
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Est. Commission</div>
                </div>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>₹{platformCommission.toFixed(0)}</div>
              </Card>

              <Card style={{ padding: '3rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#F3E8FF', color: '#7E22CE', borderRadius: 'var(--radius-xl)' }}>
                    <Users size={28} />
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Active Providers</div>
                </div>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>{providers.length}</div>
              </Card>
            </div>

            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Recent System Activity</h3>
            <Card style={{ padding: 0, border: '1px solid var(--color-border)' }}>
              {bookings.length === 0 ? (
                <p className="text-muted text-center text-lg" style={{ padding: '4rem' }}>No recent activity securely logged.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {bookings.slice(-5).reverse().map((b, idx) => (
                    <div key={b.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', borderBottom: idx === bookings.slice(-5).length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Booking #{(b.id || '').toUpperCase()}</div>
                        <div className="text-muted font-medium" style={{ fontSize: '1.125rem' }}>Requested on {b.date} at {b.time}</div>
                      </div>
                      <div style={{
                        padding: '0.625rem 1.25rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        backgroundColor: b.status === 'completed' ? '#D1FAE5' : b.status === 'rejected' ? '#FEE2E2' : b.status === 'accepted' ? '#DBEAFE' : '#FEF3C7',
                        color: b.status === 'completed' ? '#065F46' : b.status === 'rejected' ? '#991B1B' : b.status === 'accepted' ? '#1E40AF' : '#92400E',
                        textTransform: 'uppercase'
                      }}>
                        {b.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'providers' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Manage Providers</h2>
              <p className="text-muted text-lg mt-1">Verify, suspend, or manage network experts.</p>
            </div>

            <Card style={{ padding: 0, overflowX: 'auto', border: '1px solid var(--color-border)' }}>
              <div style={{ minWidth: '800px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: 'var(--color-background)' }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                      <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Area</th>
                      <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jobs</th>
                      <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p, idx) => (
                      <tr key={p.id} className="card-hover" style={{ borderBottom: idx === providers.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1.5rem 2rem', fontWeight: 700, fontSize: '1rem' }}>{p.name}</td>
                        <td style={{ padding: '1.5rem 2rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{p.district.replace('_', ' ').toUpperCase()}</td>
                        <td style={{ padding: '1.5rem 2rem', fontSize: '1rem', fontWeight: 600 }}>{p.jobsCompleted}</td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em' }}>VERIFIED</span>
                        </td>
                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                          <Button variant="ghost" size="sm" style={{ color: 'var(--color-error)' }}>Suspend</Button>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '1px solid var(--color-border)', backgroundColor: '#F8FAFC' }}>
                      <td style={{ padding: '1.5rem 2rem', fontWeight: 700, fontSize: '1rem' }}>Rakesh Singh</td>
                      <td style={{ padding: '1.5rem 2rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>SONITPUR</td>
                      <td style={{ padding: '1.5rem 2rem', fontSize: '1rem', fontWeight: 600 }}>0</td>
                      <td style={{ padding: '1.5rem 2rem' }}>
                        <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em' }}>PENDING</span>
                      </td>
                      <td style={{ padding: '1.5rem 2rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button variant="outline" size="sm" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)', height: '32px' }}><CheckCircle size={14} style={{ marginRight: '0.25rem' }} /> Approve</Button>
                        <Button variant="outline" size="sm" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)', height: '32px' }}><XCircle size={14} style={{ marginRight: '0.25rem' }} /> Reject</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
