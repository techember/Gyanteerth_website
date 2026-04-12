import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Globe2, Heart, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { staticProjects } from '../data/staticData';
import founderImg from '../assets/founder.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Fetch banners
    fetch('http://localhost:5000/api/banners')
      .then(res => res.json())
      .then(data => {
        const active = data.find(b => b.active);
        if (active) {
          setActiveBanner(active);
          if (active.type === 'popup') setShowPopup(true);
        }
      });

    // Fetch stats
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'users': return <Users size={40} className="stat-icon" />;
      case 'globe': return <Globe2 size={40} className="stat-icon" />;
      case 'heart': return <Heart size={40} className="stat-icon" />;
      default: return <Star size={40} className="stat-icon" />;
    }
  };

  return (
    <div className="home-page animate-fade-in">
      <Helmet>
        <title>GyanTeerth NGO | Foundation for Education & Welfare</title>
        <meta name="description" content="GYANTEERTH Shiksha Evam Kalyan Sansthan is committed to social welfare, education, healthcare, and community impact in Gwalior and beyond." />
        <meta name="keywords" content="NGO, Gwalior, Social Welfare, Community Impact, GYANTEERTH, Shiksha Sansthan" />
      </Helmet>

      {/* Popup Overlay */}
      {showPopup && activeBanner && (
        <div className="modal-overlay" style={{zIndex: 2000}}>
          <div className="modal-content card animate-fade-in" style={{maxWidth: '500px', textAlign: 'center', padding: '0'}}>
            <button className="close-btn" onClick={() => setShowPopup(false)} style={{zIndex: 10, right: '10px', top: '10px', background: 'rgba(255,255,255,0.8)'}}><X size={24} /></button>
            
            <div onClick={() => {
              if(activeBanner.link) {
                setShowPopup(false);
                window.location.href = activeBanner.link;
              }
            }} style={{cursor: activeBanner.link ? 'pointer' : 'default'}}>
              {activeBanner.image && <img src={activeBanner.image} alt="Alert" style={{width: '100%', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)', maxHeight: '300px', objectFit: 'cover'}} />}
              <div style={{padding: '2rem'}}>
                <h2 style={{color: 'var(--primary)', marginBottom: '1rem'}}>{activeBanner.title}</h2>
                <p style={{marginBottom: '2rem', color: 'var(--text-light)'}}>{activeBanner.text}</p>
                {activeBanner.link && (
                  <button className="btn btn-primary" style={{width: '100%'}}>Check Details</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Banner */}
      {activeBanner && activeBanner.type === 'floating' && (
        <div className="floating-banner" style={{
          position: 'fixed', bottom: '20px', right: '20px', 
          backgroundColor: 'var(--primary)', color: 'white', 
          padding: '1rem 2rem', borderRadius: '50px', 
          zIndex: 1000, boxShadow: 'var(--shadow)',
          display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <span>{activeBanner.title}</span>
          <Link to={activeBanner.link} className="btn btn-secondary btn-sm" style={{borderRadius: '50px'}}>Go</Link>
          <X size={18} cursor="pointer" onClick={() => setActiveBanner(null)} />
        </div>
      )}
      {/* Hero Section */}
      <section className="hero" style={{backgroundImage: `url(${staticProjects.length > 3 ? staticProjects[3].image : '/images/hero.jpg'})`}}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering Communities. <br /> Transforming Lives.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join GyanTeerth NGO in our mission to create sustainable social welfare and drive meaningful impact for those who need it most.
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/projects" className="btn btn-secondary btn-lg">View Our Projects</Link>
            <Link to="/about" className="btn btn-outline-white btn-lg">Learn More</Link>
          </motion.div>
        </div>
      </section>

      <section className="section intro-section">
        <div className="container intro-container">
          <div className="intro-image" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', height: '400px' }}>
            <img src={founderImg} alt="Dheeraj Bahrani - Director" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="intro-text">
            <h2>Our Foundation</h2>
            <p>GYANTEERTH Shiksha Evam Kalyan Sansthan is a registered NGO committed to grassroots development. Led by <strong>Dheeraj Bahrani</strong>, we work tirelessly to bridge educational gaps, ensure hygiene, and empower communities.</p>
            <div className="quote-box" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)', background: '#f8fafc', borderRadius: '0 10px 10px 0', marginBottom: '2rem' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-dark)' }}>"Transforming Gwalior through consistent social action and dedicated community empowerment."</p>
                <p className="mt-2" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>- Dheeraj Bahrani, Founder & Director</p>
            </div>
            <Link to="/about" className="link-with-icon">
              Read Our Vision <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        <div className="container" style={{ marginTop: '4rem' }}>
          <div className="intro-stats">
            {stats.map(stat => (
              <div className="stat-card" key={stat.id}>
                {getIcon(stat.icon)}
                <h3 className="stat-number">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="section featured-projects bg-light">
        <div className="container">
          <h2 className="section-title">Featured Initiatives</h2>
          <div className="project-grid">
            {(staticProjects).slice(0, 4).map((project) => (
              <div className="card project-card" key={project._id} onClick={() => navigate(`/projects/${project._id}`)} style={{cursor: 'pointer'}}>
                <div className="project-image" style={{backgroundImage: `url(${project.image})`}}></div>
                <div className="project-content">
                  <span className="project-category">{project.title}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description.substring(0, 120)}...</p>
                  <Link to="/projects" className="btn btn-outline-primary">Read More</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/projects" className="btn btn-primary">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container cta-container">
          <h2>Ready to Make an Impact?</h2>
          <p>Support our cause and help us drive meaningful impact in the community. Every bit of support counts.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-secondary btn-lg">Get in Touch</Link>
            <Link to="/projects" className="btn btn-primary btn-lg">Explore Projects</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
