import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Menu, X, LayoutDashboard, LogOut, User as UserIcon, Briefcase } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user ? [
    { label: 'Dashboard', path: `/${user.role}/dashboard`, icon: <LayoutDashboard size={20} /> },
    { label: 'Profile', path: `/${user.role}/dashboard`, icon: <UserIcon size={20} /> },
  ] : [
    { label: 'Log in', path: '/login' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="glass" style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '80px'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-primary)', letterSpacing: '-0.05em' }}>
            <Link to="/" style={{ color: 'inherit' }}>AYS.</Link>
          </div>

          {/* Desktop Nav */}
          <div className="lg-flex hidden" style={{ gap: '1.5rem', alignItems: 'center' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-accent-subtle)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                    {user.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9375rem' }}>{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/${user.role}/dashboard`)}>Dashboard</Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '1rem' }}>Log in</Link>
                <Button size="md" onClick={() => navigate('/register')}>Become a Provider</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg-hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--color-primary)', padding: '0.5rem' }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 99,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user && (
              <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-background)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem' }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user.role} Account</div>
                </div>
              </div>
            )}
            
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  backgroundColor: 'var(--color-background)'
                }}
              >
                {'icon' in link && link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user ? (
              <Button fullWidth variant="outline" size="lg" onClick={handleLogout}>
                <LogOut size={20} style={{ marginRight: '0.75rem' }} />
                Logout
              </Button>
            ) : (
              <>
                <Button fullWidth size="lg" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                  <Briefcase size={20} style={{ marginRight: '0.75rem' }} />
                  Become a Provider
                </Button>
                <Button fullWidth variant="outline" size="lg" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
