import { Link } from 'react-router-dom';
import { Target, Eye, Heart, ShieldCheck, MapPin, Award } from 'lucide-react';
import founderImg from '../assets/founder.png';
import './Pages.css';

const About = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Legacy of GyanTeerth</h1>
        <p className="page-subtitle">A journey of compassion, dedication, and transformative change under the leadership of Dheeraj Bahrani.</p>
      </div>

      <div className="about-grid">
        <div className="about-section">
          <div className="about-image" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200" alt="Community Empowerment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="about-content">
            <span className="project-category">Established 2010</span>
            <h2 className="mt-2">Our Story & Purpose</h2>
            <p>GYANTEERTH Shiksha Evam Kalyan Sansthan was founded on the fundamental belief that every human being deserves a life of dignity, health, and opportunity. Starting as a grassroots initiative in Gwalior, we have evolved into a pillar of support for the underprivileged, bridging gaps in education, healthcare, and social security.</p>
            <p className="mt-3">Under our leadership, we have successfully implemented numerous projects that have directly impacted thousands of lives. Our approach combines traditional values of community service with modern, result-oriented social welfare strategies.</p>
          </div>
        </div>

        <div className="about-section reverse mt-5">
          <div className="about-image">
             <div style={{ position: 'relative' }}>
                <img src={founderImg} alt="Dheeraj Bahrani" style={{ width: '100%', borderRadius: '20px' }} />
                <div className="director-badge" style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    Leading with Vision
                </div>
             </div>
          </div>
          <div className="about-content">
            <h2 style={{ color: 'var(--secondary)' }}>Founder & Director's Message</h2>
            <div className="quote-box" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', borderLeft: '5px solid var(--secondary)', margin: '1.5rem 0' }}>
                <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--text-dark)' }}>
                    "Our mission at GyanTeerth is not just to provide temporary relief, but to create sustainable ecosystems where every child can learn, every woman can thrive, and every family can live without the fear of deprivation. We believe in the power of collective action and the resilience of the human spirit."
                </p>
                <p className="mt-3" style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>- Dheeraj Bahrani</p>
                <small style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Founder & Director</small>
            </div>
            <p>Dheeraj Bahrani's leadership has been instrumental in steering GyanTeerth towards becoming one of Gwalior's most impactful social organizations. His dedication to grassroots work and strategic vision ensures that every rupee contributed is utilized for maximum social impact.</p>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: '5rem' }}>
        <div className="intro-stats">
          <div className="stat-card">
            <Target size={40} className="stat-icon" />
            <h3>Our Mission</h3>
            <p className="mt-3 text-light">To eradicate social inequality through high-impact programs in education, hygiene, and rural development, ensuring a self-sufficient future for the marginalized.</p>
          </div>
          <div className="stat-card">
            <Eye size={40} className="stat-icon" />
            <h3>Our Vision</h3>
            <p className="mt-3 text-light">A poverty-free society where access to quality education and healthcare is a universal right, not a luxury, enabling every individual to realize their full potential.</p>
          </div>
          <div className="stat-card">
            <ShieldCheck size={40} className="stat-icon" />
            <h3>Transparency</h3>
            <p className="mt-3 text-light">Maintaining the highest standards of accountability in all our operations, ensuring that every donation creates a measurable positive impact on the ground.</p>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: '5rem' }}>
        <h2 className="text-center mb-5">Our Operational Core</h2>
        <div className="about-grid">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <MapPin className="text-secondary" size={32} />
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Headquarters</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Rai Singh Ka Bagh, Kuve Ke Paas, Roxy Talkies, Lashkar, Gwalior (M.P.)</p>
                    </div>
                </div>
                <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <Award className="text-secondary" size={32} />
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Our Ethics</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Guided by the leadership of Dheeraj Bahrani, we adhere to absolute integrity and community-first values in all our initiatives.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="section text-center" style={{marginTop: '5rem', background: 'var(--bg-light)', padding: '4rem 2rem', borderRadius: '30px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Become a Part of Our Legacy</h2>
        <p className="mb-4" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>Whether through support, partnership, or spreading the word, your involvement fuels our mission to transform lives.</p>
        <Link to="/contact" className="btn btn-primary btn-lg">Connect With Us</Link>
      </div>
    </div>
  );
};

export default About;
