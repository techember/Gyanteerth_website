import { FileText, Download, Award, ShieldCheck } from 'lucide-react';
import './Pages.css';

const Reports = () => {
  const reports = [
    { id: 1, title: 'Annual Report 2024', desc: 'Comprehensive overview of financials and impacts in 2024.', size: '4.2 MB' },
    { id: 2, title: 'Annual Report 2023', desc: 'Financial summaries, project insights, and future goals.', size: '3.8 MB' },
    { id: 3, title: 'Project Health Initiative: Q3 2024', desc: 'Detailed tracking of medical camps and hygiene workshops.', size: '1.5 MB' },
    { id: 4, title: 'Transparency Policy & Audit Report', desc: 'Third-party financial audit mapping all donations to projects.', size: '2.4 MB' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reports & Transparency</h1>
        <p className="page-subtitle">At GYANTEERTH Shiksha Evam Kalyan Sansthan, we believe in absolute transparency. Every donation is accounted for and directed towards creating tangible, positive impacts. Explore our reports and financial audits.</p>
      </div>

      <div className="section pt-0">
        <div className="intro-stats mb-5">
          <div className="stat-card" style={{padding: '1.5rem'}}>
            <ShieldCheck size={40} className="stat-icon" />
            <h3>100% Transparency</h3>
            <p className="text-light text-sm mt-2">Verified financial audits from reputed firms.</p>
          </div>
          <div className="stat-card" style={{padding: '1.5rem'}}>
            <Award size={40} className="stat-icon" />
            <h3>Recognitions</h3>
            <p className="text-light text-sm mt-2">Awarded for distinct grassroots impacts.</p>
          </div>
        </div>

        <h2 className="section-title text-left">Latest Downloads</h2>
        <div className="reports-grid">
          {reports.map(report => (
            <div key={report.id} className="card report-card">
              <div className="report-icon">
                <FileText size={32} />
              </div>
              <div style={{flex: 1}}>
                <h3 style={{fontSize: '1.1rem', marginBottom: '0.25rem'}}>{report.title}</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem'}}>{report.desc}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '0.8rem', fontWeight: 600}}>{report.size}</span>
                  <a href="#" className="link-with-icon" style={{fontSize: '0.85rem', gap: '0.25rem'}}>
                    <Download size={16} /> Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
