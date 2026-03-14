import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Gyanteerth Logo" className="footer-logo-img" />
            <div className="logo-text">
              <span className="logo-main" style={{color: 'var(--white)'}}>GYANTEERTH</span>
              <span className="logo-sub" style={{color: 'var(--secondary-light)'}}>Shiksha Evam Kalyan Sansthan</span>
            </div>
          </Link>
          <p className="footer-desc">
            GYANTEERTH Shiksha Evam Kalyan Sansthan is dedicated to empowering communities through sustainable social welfare and impactful grassroots initiatives.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>
        
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/projects">Our Projects</Link></li>
            <li><Link to="/gallery">Media Gallery</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            <li><MapPin size={18} /> Rai Singh Ka Bagh, Roxy Talkies, Lashkar, Gwalior (M.P.)</li>
            <li><Phone size={18} /> +91-9826537933</li>
            <li><Mail size={18} /> gyanteerthsiksha@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GyanTeerth NGO. All Rights Reserved.</p>
        <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
          Developed by <a href="https://techember.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-light)', fontWeight: '600' }}>Tech Ember Solutions</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
