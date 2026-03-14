import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, ChevronLeft, ChevronRight, X, Maximize2, Users, Clock, Target, Award } from 'lucide-react';
import './Pages.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === parseInt(id));
        setProject(found);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const allImages = project ? [project.image, ...(project.images || [])].filter(img => img) : [];

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <div className="page-container text-center">Loading Project Details...</div>;
  if (!project) return <div className="page-container text-center">Project not found. <Link to="/projects">Go Back</Link></div>;

  return (
    <div className="page-container">
      <button className="btn btn-outline-primary mb-4" onClick={() => navigate('/projects')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={18} /> Back to Projects
      </button>

      <div className="event-detail-hero card">
        <div className="event-hero-image" style={{ backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'})` }}>
           <div className="hero-zoom-btn" onClick={() => setLightboxIndex(0)} title="View Fullscreen">
              <Maximize2 size={24} />
           </div>
        </div>
        <div className="event-hero-content">
          <span className={`project-category ${project.status?.toLowerCase()}`}>{project.status}</span>
          <h1 className="page-title" style={{ textAlign: 'left', margin: '0.5rem 0' }}>{project.title}</h1>
          <div className="project-meta" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
            <div className="meta-item"><MapPin size={20} /> {project.location}</div>
            <div className="meta-item"><Clock size={20} /> {project.duration}</div>
          </div>
        </div>
      </div>

      <div className="project-highlight-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="stat-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Target size={30} className="stat-icon" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{project.goalsLabel || 'Core Goal'}</h4>
          <p style={{ fontWeight: '700' }}>{project.goals}</p>
        </div>
        <div className="stat-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Users size={30} className="stat-icon" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{project.beneficiariesLabel || 'Beneficiaries'}</h4>
          <p style={{ fontWeight: '700' }}>{project.beneficiaries}</p>
        </div>
        <div className="stat-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Award size={30} className="stat-icon" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{project.impactLabel || 'Total Impact'}</h4>
          <p style={{ fontWeight: '700' }}>{project.impact}</p>
        </div>
      </div>

      <div className="event-main-content">
        <section className="event-description-section">
          <h2>Project Overview</h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--text-light)', fontSize: '1.1rem' }}>
            {project.description}
          </p>
        </section>

        {allImages.length > 1 && (
          <section className="event-gallery-section" style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Project Implementation Gallery</h2>
            <div className="gallery-grid">
              {allImages.map((img, idx) => (
                <div key={idx} className="gallery-item" onClick={() => setLightboxIndex(idx)}>
                  <img src={img} alt={`Project ${idx}`} />
                  <div className="gallery-overlay">
                    <Maximize2 size={24} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
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

export default ProjectDetails;
