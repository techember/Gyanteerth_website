import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import './Pages.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => e.id === parseInt(id));
        setEvent(found);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const allImages = event ? [event.image, ...(event.images || [])].filter(img => img) : [];

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <div className="page-container text-center">Loading Event Details...</div>;
  if (!event) return <div className="page-container text-center">Event not found. <Link to="/events">Go Back</Link></div>;

  return (
    <div className="page-container">
      <button className="btn btn-outline-primary mb-4" onClick={() => navigate('/events')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={18} /> Back to Events
      </button>

      <div className="event-detail-hero card">
        <div className="event-hero-image" style={{ backgroundImage: `url(${event.image})` }}>
           <div className="hero-zoom-btn" onClick={() => setLightboxIndex(0)} title="View Fullscreen">
              <Maximize2 size={24} />
           </div>
        </div>
        <div className="event-hero-content">
          <span className="project-category">{event.category}</span>
          <h1 className="page-title" style={{ textAlign: 'left', margin: '0.5rem 0' }}>{event.title}</h1>
          <div className="project-meta" style={{ marginTop: '1rem' }}>
            <div className="meta-item"><Calendar size={20} /> {event.date}</div>
            <div className="meta-item"><MapPin size={20} /> {event.location}</div>
          </div>
        </div>
      </div>

      <div className="event-main-content">
        <section className="event-description-section">
          <h2>About this Event</h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--text-light)', fontSize: '1.1rem' }}>
            {event.description}
          </p>
        </section>

        {allImages.length > 1 && (
          <section className="event-gallery-section" style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Event Highlights Gallery</h2>
            <div className="gallery-grid">
              {allImages.map((img, idx) => (
                <div key={idx} className="gallery-item" onClick={() => setLightboxIndex(idx)}>
                  <img src={img} alt={`Event ${idx}`} />
                  <div className="gallery-overlay">
                    <Maximize2 size={24} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox / Fullscreen Selection */}
      {lightboxIndex >= 0 && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(-1)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(-1)}><X size={32} /></button>
          
          <button className="lightbox-nav prev" onClick={handlePrev}>
            <ChevronLeft size={40} />
          </button>
          
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={allImages[lightboxIndex]} alt="Fullscreen" />
            <div className="lightbox-counter">{lightboxIndex + 1} / {allImages.length}</div>
          </div>

          <button className="lightbox-nav next" onClick={handleNext}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
