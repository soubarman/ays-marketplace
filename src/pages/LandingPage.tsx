import { useState } from 'react';
import { Search, Wrench, Zap, Droplets, Paintbrush, Hammer, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Select from '../components/Select';

const assamDistricts = [
  { label: 'Kamrup Metropolitan', value: 'kamrup_metro' },
  { label: 'Jorhat', value: 'jorhat' },
  { label: 'Dibrugarh', value: 'dibrugarh' },
  { label: 'Cachar', value: 'cachar' },
  { label: 'Sonitpur', value: 'sonitpur' },
];

const services = [
  { id: 'electrician', name: 'Electrician', icon: Zap, color: '#F59E0B' },
  { id: 'plumber', name: 'Plumber', icon: Droplets, color: '#3B82F6' },
  { id: 'ac_repair', name: 'AC Repair', icon: Wrench, color: '#10B981' },
  { id: 'painter', name: 'Painter', icon: Paintbrush, color: '#8B5CF6' },
  { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: '#F97316' },
  { id: 'mechanic', name: 'Mechanic', icon: Wrench, color: '#64748B' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [district, setDistrict] = useState('');
  const [service, setService] = useState('');

  const handleSearch = () => {
    if (district && service) {
      navigate(`/customer/dashboard?service=${service}&district=${district}`);
    }
  };

  return (
    <div style={{ paddingBottom: '0' }}>
      {/* Premium Hero Section */}
      <section className="bg-gradient-mesh lg-pt-32 lg-pb-40" style={{ 
        position: 'relative', 
        padding: '6rem 1rem 8rem 1rem', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '9999px', color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            #1 SERVICES PLATFORM IN ASSAM
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1, maxWidth: '800px', margin: '0 auto' }}>
            Expert local services, <br/>
            <span style={{ color: 'var(--color-accent)' }}>right at your doorstep.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '1.5rem auto 0 auto' }}>
            Instant bookings. Verified professionals. Transparent pricing. Let us handle the hard work while you relax.
          </p>
        </div>
      </section>

      {/* Floating Search Card */}
      <div className="container" style={{ marginTop: '-5rem', position: 'relative', zIndex: 10, paddingBottom: '5rem' }}>
        <div className="card glass lg-grid lg-grid-cols-3 lg-p-10 lg-items-end" style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
          <div>
            <Select 
              label="What do you need?" 
              options={services.map(s => ({ label: s.name, value: s.id }))} 
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <div>
            <Select 
              label="Where are you in Assam?" 
              options={assamDistricts} 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <Button size="xl" onClick={handleSearch} disabled={!service || !district}>
            <Search size={22} style={{ marginRight: '0.75rem' }} /> Search Experts
          </Button>
        </div>
      </div>

      {/* Popular Services */}
      <section className="container mb-8" style={{ paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }} className="lg-flex-row lg-items-end lg-justify-between">
           <div>
             <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }} className="lg-text-4xl">Popular Services</h2>
             <p className="text-muted text-lg">Top-rated professional services near you.</p>
           </div>
           <Button variant="ghost" style={{ alignSelf: 'flex-start' }}>View All Services &rarr;</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          {services.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="card card-hover" style={{ cursor: 'pointer', padding: '2.5rem 1.5rem', textAlign: 'center', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} onClick={() => navigate(`/customer/dashboard?service=${s.id}`)}>
                <div style={{ backgroundColor: `${s.color}15`, padding: '1.25rem', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem', display: 'inline-flex' }}>
                  <Icon size={36} color={s.color} />
                </div>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{s.name}</h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Premium */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
             <h2 style={{ fontSize: '2.5rem', color: 'white' }}>How it works</h2>
             <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', marginTop: '1rem' }}>Three simple steps to tackle any job.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', boxShadow: '0 0 0 8px rgba(37,99,235,0.2)' }}>1</div>
               <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Verify Requirements</h3>
               <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: '1.6' }}>Select your exact service need and local district to see upfront pricing without hidden fees.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', boxShadow: '0 0 0 8px rgba(37,99,235,0.2)' }}>2</div>
               <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Pick an Expert</h3>
               <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: '1.6' }}>Browse vetted professionals, read real reviews, and secure a date and time that fits your schedule.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', boxShadow: '0 0 0 8px rgba(37,99,235,0.2)' }}>3</div>
               <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Job Completed</h3>
               <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', lineHeight: '1.6' }}>The expert arrives fully equipped. You only pay when the service is spectacularly delivered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AYS / Premium Form */}
      <section className="container" style={{ padding: '8rem 0' }}>
        <div className="lg-grid lg-grid-cols-2 lg-gap-24 lg-items-center" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '2rem', lineHeight: 1.1 }} className="lg-text-6xl">The modern way to maintain your home.</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)', color: 'var(--color-success)' }}>
                  <CheckCircle size={24} /> 
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Verified professionals</h4>
                  <p className="text-muted text-lg">Every single provider undergoes heavy background checks before joining AYS.</p>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)', color: 'var(--color-success)' }}>
                  <CheckCircle size={24} /> 
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Transparent fixed pricing</h4>
                  <p className="text-muted text-lg">No haggling or unexpected upcharges. See the hourly rate right in the app.</p>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)', color: 'var(--color-success)' }}>
                  <CheckCircle size={24} /> 
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Instant digital booking</h4>
                  <p className="text-muted text-lg">Pick your slot and get confirmation in seconds right to your dashboard.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="card lg-p-16" style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-xl)', border: 'none' }}>
             <h3 style={{ marginBottom: '1rem', fontSize: '1.75rem' }} className="lg-text-3xl">Join as a Professional</h3>
             <p className="text-muted mb-8 text-lg">Are you a skilled professional looking to grow your business? Join the fastest growing network in Assam and earn on your schedule.</p>
             <Button size="lg" fullWidth onClick={() => navigate('/register')} className="lg-size-xl">Apply as a Provider</Button>
             <p className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>Over 1,000+ experts registered already.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: 'white', borderTop: '1px solid var(--color-border)', padding: '6rem 0' }}>
        <div className="container">
          <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Loved by locals across Assam</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>A</div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.125rem' }}>Amit Sharma</h4>
                  <span className="text-muted">Guwahati</span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '1.125rem', fontStyle: 'italic', lineHeight: '1.6' }}>"Booked an electrician for an urgent short-circuit. The professional arrived in 30 minutes and fixed it quickly. AYS changed everything for me!"</p>
            </div>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>R</div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.125rem' }}>Rina Das</h4>
                  <span className="text-muted">Jorhat</span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '1.125rem', fontStyle: 'italic', lineHeight: '1.6' }}>"Very smooth experience. The plumber was verified and polite. Transparent pricing makes this the best platform for Assam!"</p>
            </div>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>B</div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.125rem' }}>Bikash Borah</h4>
                  <span className="text-muted">Dibrugarh</span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '1.125rem', fontStyle: 'italic', lineHeight: '1.6' }}>"Getting an AC repair mechanic was so tough earlier. Now I just use AYS. Fast, extremely reliable and completely effortless."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '8rem 2rem 4rem 2rem', textAlign: 'center', marginTop: 'auto' }}>
        <div className="container">
          <h2 className="lg-text-6xl" style={{ color: 'white', marginBottom: '2.5rem', fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Ready to Get Started?</h2>
          <div className="lg-flex-row lg-justify-center" style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
             <Button variant="white" size="lg" onClick={() => navigate('/customer/search')} className="lg-size-xl lg-px-12" style={{ padding: '1rem 2rem' }}>Book a Service</Button>
             <Button variant="ghost" size="lg" onClick={() => navigate('/register')} className="lg-size-xl lg-px-12" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 2rem' }}>Register as Provider</Button>
          </div>
          <div className="lg-flex-row lg-justify-between lg-mt-32" style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <span>&copy; 2026 At Your Service (AYS) Assam. All rights reserved.</span>
            <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem' }}>AYS.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
