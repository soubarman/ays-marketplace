import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass" style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-primary)', letterSpacing: '-0.05em' }}>
        <Link to="/" style={{ color: 'inherit' }}>AYS.</Link>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Hi, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/${user.role}/dashboard`)}>Dashboard</Button>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Log in</Link>
            <Button size="sm" onClick={() => navigate('/register')}>Become a Provider</Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
