import { useState, useEffect } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './Pages.css';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, eventsRes, projectsRes] = await Promise.all([
          fetch('http://localhost:5000/api/gallery'),
          fetch('http://localhost:5000/api/events'),
          fetch('http://localhost:5000/api/projects')
        ]);

        const galleryData = await galleryRes.json();
        const eventsData = await eventsRes.json();
        const projectsData = await projectsRes.json();

        // 1. Process Gallery specific images
        const galleryItems = galleryData.map(item => ({
          id: `gal-${item.id}`,
          url: item.url,
          project: item.project || 'General',
          type: 'Gallery'
        }));

        // 2. Process Event images
        const eventItems = [];
        eventsData.forEach(event => {
          // Add main image
          if (event.image) {
            eventItems.push({
              id: `evt-main-${event.id}`,
              url: event.image,
              project: event.title,
              type: 'Event'
            });
          }
          // Add gallery images if any
          if (event.images && event.images.length > 0) {
            event.images.forEach((img, idx) => {
              eventItems.push({
                id: `evt-gal-${event.id}-${idx}`,
                url: img,
                project: event.title,
                type: 'Event'
              });
            });
          }
        });

        // 3. Process Project images
        const projectItems = [];
        projectsData.forEach(project => {
          // Add main image
          if (project.image) {
            projectItems.push({
              id: `prj-main-${project.id}`,
              url: project.image,
              project: project.title,
              type: 'Project'
            });
          }
          // Add gallery images if any
          if (project.images && project.images.length > 0) {
            project.images.forEach((img, idx) => {
              projectItems.push({
                id: `prj-gal-${project.id}-${idx}`,
                url: img,
                project: project.title,
                type: 'Project'
              });
            });
          }
        });

        // Combine all and unique URLs to avoid duplicates if same image used multiple times
        const allItems = [...galleryItems, ...eventItems, ...projectItems];
        
        // Remove duplicates based on URL
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.url, item])).values());
        
        setItems(uniqueItems);
      } catch (err) {
        console.error('Failed to fetch media data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const projects = ['All', ...new Set(items.map(item => item.project))];
  const filteredItems = filter === 'All' ? items : items.filter(item => item.project === filter);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Media Hub</h1>
        <p className="page-subtitle">A unified view of all our initiatives, events, and community work captured through the lens.</p>
      </div>

      <div className="events-tabs" style={{ marginBottom: '3rem' }}>
        {projects.map(proj => (
          <button 
            key={proj}
            onClick={() => setFilter(proj)}
            className={`event-tab-btn ${filter === proj ? 'active' : ''}`}
          >
            {proj}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center">Synchronizing Gallery...</div>
      ) : (
        <div className="gallery-grid">
          {filteredItems.map((item, idx) => (
            <div key={item.id} className="gallery-item" onClick={() => setLightboxIndex(idx)}>
              <img src={item.url} alt={item.project} loading="lazy" />
              <div className="gallery-overlay">
                <div style={{ transform: 'translateY(10px)', transition: 'transform 0.3s', padding: '1rem', textAlign: 'center' }}>
                  <Maximize2 size={32} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.project}</p>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8 }}>From {item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(-1)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(-1)}><X size={32} /></button>
          
          <button className="lightbox-nav prev" onClick={handlePrev}>
            <ChevronLeft size={40} />
          </button>
          
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={filteredItems[lightboxIndex].url} alt="Fullscreen View" />
            <div className="lightbox-counter">
                <span style={{ color: 'white', fontWeight: 'bold' }}>{filteredItems[lightboxIndex].project}</span> 
                <span style={{ margin: '0 10px', opacity: 0.5 }}>|</span>
                {lightboxIndex + 1} of {filteredItems.length}
            </div>
          </div>

          <button className="lightbox-nav next" onClick={handleNext}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
