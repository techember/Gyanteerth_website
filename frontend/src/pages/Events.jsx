import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import './Pages.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return event.date >= today;
    if (activeTab === 'completed') return event.date < today;
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Events Hub</h1>
        <p className="page-subtitle">Explore our upcoming initiatives and look back at our successful past events.</p>
      </div>

      <div className="events-tabs">
        <button 
          className={`event-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Events
        </button>
        <button 
          className={`event-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`event-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Past Events
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading Events...</div>
      ) : (
        <div className="projects-grid">
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
            <div className="card project-card" key={event.id} onClick={() => navigate(`/events/${event.id}`)} style={{ cursor: 'pointer' }}>
              <div className="project-image" style={{backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800'})`}}></div>
              <div className="project-content">
                <span className={`project-category ${event.date < today ? 'past' : ''}`}>
                  {event.date < today ? 'Completed' : event.category}
                </span>
                <h3>{event.title}</h3>
                <div className="project-meta">
                  <div className="meta-item"><Calendar size={16} /> {event.date}</div>
                  <div className="meta-item"><MapPin size={16} /> {event.location}</div>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
                  {event.description?.substring(0, 120)}...
                </p>
                <div className="btn btn-outline-primary mt-3" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content'}}>
                  {event.date < today ? 'View Highlights' : 'View Details & Gallery'} <ArrowRight size={16} />
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center full-width" style={{ padding: '3rem', opacity: 0.6 }}>
              {activeTab === 'upcoming' ? 'No upcoming events scheduled. Stay tuned!' : 
               activeTab === 'completed' ? 'No past events recorded yet.' : 
               'No events to display.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
