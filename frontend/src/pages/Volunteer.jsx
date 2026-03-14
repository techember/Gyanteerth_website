import { useState } from 'react';
import { Send, Heart, MapPin, Users } from 'lucide-react';
import './Pages.css';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', area: '', message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await fetch('http://localhost:5000/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        setStatus('Registration successful! We will contact you soon.');
        setFormData({ name: '', email: '', phone: '', area: '', message: '' });
      } else {
        setStatus('Failed to submit. Try again later.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit. Try again later.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Volunteer With Us</h1>
        <p className="page-subtitle">Your time and skills can bring about a world of change. Join our community of dedicated volunteers to support our projects on the ground.</p>
      </div>

      <div className="contact-info mt-5" style={{marginBottom: '3rem'}}>
        <div className="info-card">
          <Heart className="info-icon" size={40} />
          <h3>Why Volunteer?</h3>
          <p className="text-sm text-light mt-2">Become a catalyst for change, gain incredible experiences, and create an impactful footprint in society.</p>
        </div>
        <div className="info-card">
          <MapPin className="info-icon" size={40} />
          <h3>On-Ground Work</h3>
          <p className="text-sm text-light mt-2">Participate in teaching programs, health drives, community cleanups, and administrative tasks.</p>
        </div>
        <div className="info-card">
          <Users className="info-icon" size={40} />
          <h3>Online Volunteering</h3>
          <p className="text-sm text-light mt-2">Help us from home with digital marketing, graphic design, content writing, and fund raising activities.</p>
        </div>
      </div>

      <div className="form-container">
        <h2 className="text-center mb-4">Volunteer Registration Form</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name *</label>
            <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="area">Area of Interest *</label>
            <select id="area" name="area" className="form-control" value={formData.area} onChange={handleChange} required>
              <option value="" disabled>Select Area</option>
              <option value="Education">Education & Teaching</option>
              <option value="Healthcare">Healthcare & Hygiene</option>
              <option value="Environment">Environmental Campaigns</option>
              <option value="Marketing">Marketing & Design</option>
              <option value="Other">Other Skills</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label className="form-label" htmlFor="message">Why do you want to volunteer? / Message</label>
            <textarea id="message" name="message" className="form-control" value={formData.message} onChange={handleChange}></textarea>
          </div>
          
          <div className="form-group full-width text-center">
            <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}}>
              <Send size={18} className="inline mr-2" /> Register Now
            </button>
            {status && <p className="mt-3 text-secondary font-weight-bold">{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Volunteer;
