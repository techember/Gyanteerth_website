import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Award, ArrowRight, MapPin } from 'lucide-react';
import { staticProjects } from '../data/staticData';
import './Pages.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.length > 0 ? data : staticProjects);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Our Initiatives</h1>
        <p className="page-subtitle">We work on sustainable development projects that empower communities and create long-lasting impact.</p>
      </div>

      {loading ? (
        <div className="text-center">Loading Projects...</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div className="card project-card" key={project._id || project.id} onClick={() => navigate(`/projects/${project._id || project.id}`)} style={{ cursor: 'pointer' }}>
              <div className="project-image" style={{backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'})`}}>
                <span className={`project-status-badge ${project.status?.toLowerCase() || 'ongoing'}`}>{project.status || 'Ongoing'}</span>
              </div>
              <div className="project-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <MapPin size={14} /> {project.location}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description?.substring(0, 100)}...</p>
                <div className="project-features">
                  <div className="feature"><Target size={18} /> {project.goals}</div>
                  <div className="feature"><Award size={18} /> {project.impact}</div>
                </div>
                <div className="btn btn-outline-primary mt-3" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Learn More <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
