import { useState } from 'react';
import { Send, MapPin, Mail, Phone, Clock } from 'lucide-react';
import './Pages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending message...');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        setStatus('Message received! We will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('Failed to send. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to send. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">We would love to hear from you. Have inquiries, suggestions, or want to collaborate? Get in touch with us using the details below.</p>
      </div>

      <div className="contact-info mt-5">
        <div className="info-card">
          <MapPin className="info-icon" size={40} />
          <h3>Visit Us</h3>
          <p className="text-light mt-2">Rai Singh Ka Bagh, Kuve Ke Paas, Roxy Talkies, Lashkar, Gwalior (M.P.)</p>
        </div>
        <div className="info-card">
          <Phone className="info-icon" size={40} />
          <Mail className="info-icon mt-2" size={40} />
          <h3>Reach Out directly</h3>
          <p className="text-light mt-2">Phone: +91-9826537933<br/>Email: gyanteerthsiksha@gmail.com</p>
        </div>
        <div className="info-card">
          <Clock className="info-icon" size={40} />
          <h3>Working Hours</h3>
          <p className="text-light mt-2">Monday - Saturday<br/>9:00 AM - 6:00 PM</p>
        </div>
      </div>

      <div className="form-container">
        <h2 className="text-center mb-4">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name *</label>
            <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group full-width">
            <label className="form-label" htmlFor="subject">Subject *</label>
            <input type="text" id="subject" name="subject" className="form-control" value={formData.subject} onChange={handleChange} required />
          </div>
          
          <div className="form-group full-width">
            <label className="form-label" htmlFor="message">Message *</label>
            <textarea id="message" name="message" className="form-control" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          
          <div className="form-group full-width text-center">
            <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}}>
              <Send size={18} className="inline mr-2" /> Send Message
            </button>
            {status && <p className="mt-3 text-secondary font-weight-bold">{status}</p>}
          </div>
        </form>
      </div>

      <div className="map-container">
        {/* Placeholder for Google Maps */}
        <iframe 
          title="Google Map Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14320.188777663687!2d78.1313055871582!3d26.195143000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5f091e094d5%3A0x3a984ba20a3c6184!2sRai%20Singh%20Ka%20Bagh%20Near%20Roxy!5e0!3m2!1sen!2sin!4v1773485877410!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{border: 0}} 
          allowFullScreen="" 
          loading="lazy">
        </iframe>
      </div>
    </div>
  );
};

export default Contact;
