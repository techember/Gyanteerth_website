import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, Briefcase, X, Save, Calendar, Megaphone, BarChart3, LogOut, Heart } from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
    const [loginData, setLoginData] = useState({ id: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState('projects');
    const [data, setData] = useState({ projects: [], gallery: [], events: [], banners: [], stats: [] });
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            const result = await res.json();
            if (result.success) {
                setIsAuthenticated(true);
                localStorage.setItem('adminAuth', 'true');
                setLoginError('');
            } else {
                setLoginError('Invalid Admin ID or Password');
            }
        } catch (err) {
            setLoginError('Server Error. Please ensure backend is running.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
    };

    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [proj, gall, eve, ban, sta] = await Promise.all([
                fetch('http://localhost:5000/api/projects').then(res => res.json()),
                fetch('http://localhost:5000/api/gallery').then(res => res.json()),
                fetch('http://localhost:5000/api/events').then(res => res.json()),
                fetch('http://localhost:5000/api/banners').then(res => res.json()),
                fetch('http://localhost:5000/api/stats').then(res => res.json())
            ]);
            setData({ projects: proj, gallery: gall, events: eve, banners: ban, stats: sta });
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-page page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                    <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white' }}>
                            <Save size={30} />
                        </div>
                        <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Admin Access</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Gyanteerth NGO Content Management</p>
                    </div>
                    <form onSubmit={handleLogin} className="admin-form">
                        <div className="form-group full-width">
                            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Admin ID</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                style={{ padding: '0.8rem' }}
                                value={loginData.id} 
                                onChange={(e) => setLoginData({...loginData, id: e.target.value})} 
                                required 
                                placeholder="Enter ID"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                style={{ padding: '0.8rem' }}
                                value={loginData.password} 
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                                required 
                                placeholder="••••••••"
                            />
                        </div>
                        {loginError && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', background: '#fdf2f2', padding: '0.5rem', borderRadius: '5px' }}>{loginError}</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>Secure Login</button>
                    </form>
                </div>
            </div>
        );
    }

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            const initialForms = {
                projects: { title: '', location: '', description: '', goals: '', goalsLabel: 'Core Goal', impact: '', impactLabel: 'Total Impact', image: '', status: 'Ongoing', beneficiaries: '', beneficiariesLabel: 'Beneficiaries', duration: '', images: [] },
                gallery: { url: '', project: '', category: '', type: 'image' },
                events: { title: '', date: '', location: '', category: '', description: '', image: '' },
                banners: { type: 'popup', title: '', text: '', active: true, image: '', link: '' },
                stats: { label: '', value: '', icon: 'users' }
            };
            setFormData(initialForms[activeTab]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileUpload = async (e, fieldName, isMultiple = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadFormData = new FormData();
        files.forEach(file => uploadFormData.append('images', file));

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadFormData
            });
            const result = await res.json();
            if (result.success) {
                if (isMultiple) {
                    const currentImages = formData[fieldName] || [];
                    setFormData({ ...formData, [fieldName]: [...currentImages, ...result.urls] });
                } else {
                    setFormData({ ...formData, [fieldName]: result.urls[0] });
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:5000/api/${activeTab}${editingItem ? `/${editingItem.id}` : ''}`;
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchData();
                handleCloseModal();
            }
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirm deletion? This action cannot be undone.')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/${activeTab}/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const tabs = [
        { id: 'projects', label: 'Projects', icon: <Briefcase size={18} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
        { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
        { id: 'banners', label: 'Popups', icon: <Megaphone size={18} /> },
        { id: 'stats', label: 'Stats', icon: <BarChart3 size={18} /> }
    ];

    return (
        <div className="admin-page page-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 className="page-title">Management Hub</h1>
                    <p className="page-subtitle">Fully control Gyanteerth NGO dynamic content and live updates.</p>
                </div>
                <button className="btn btn-outline-primary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Sign Out
                </button>
            </header>

            <div className="admin-controls">
                <div className="tab-buttons">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
                <button className="btn btn-secondary add-btn" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> New {activeTab.slice(0, -1)}
                </button>
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '5rem' }}>
                    <div className="spinner"></div>
                    <p>Loading records...</p>
                </div>
            ) : (
                <main className="admin-content card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {activeTab !== 'stats' && <th>Preview</th>}
                                <th>Details</th>
                                {activeTab === 'events' && <th>Schedule</th>}
                                {activeTab === 'stats' && <th>Icon</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data[activeTab] || []).map(item => (
                                <tr key={item.id}>
                                    {activeTab !== 'stats' && (
                                        <td>
                                            <img src={item.image || item.url || 'https://via.placeholder.com/100'} alt="Preview" className="admin-thumb" style={{ objectFit: 'cover', borderRadius: '8px' }} />
                                        </td>
                                    )}
                                    <td>
                                        <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                                            {item.title || item.project || item.label || 'Untitled'}
                                        </div>
                                        {item.text && <p className="text-sm" style={{ color: 'var(--text-light)', maxWidth: '300px' }}>{item.text.substring(0, 60)}...</p>}
                                        {activeTab === 'stats' && <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', fontWeight: '800' }}>{item.value}</p>}
                                    </td>
                                    {activeTab === 'events' && (
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>{item.date}</span>
                                                <small style={{ color: 'var(--text-light)' }}>{item.location}</small>
                                            </div>
                                        </td>
                                    )}
                                    {activeTab === 'stats' && <td><span style={{ textTransform: 'capitalize' }}>{item.icon}</span></td>}
                                    <td>
                                        <div className="action-btns">
                                            <button className="icon-btn edit" onClick={() => handleOpenModal(item)} title="Edit record"><Edit2 size={16} /></button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(item.id)} title="Remove record"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card animate-fade-in" style={{ width: '90%', maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {editingItem ? <Edit2 size={24} /> : <Plus size={24} />}
                                {editingItem ? 'Modify' : 'Add New'} {activeTab.slice(0, -1)}
                            </h2>
                            <button className="close-btn" onClick={handleCloseModal}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            {activeTab === 'projects' && (
                                <>
                                    <div className="form-group">
                                        <label>Project Title</label>
                                        <input type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input type="text" name="location" className="form-control" value={formData.location || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Current Status</label>
                                        <select name="status" className="form-control" value={formData.status || 'Ongoing'} onChange={handleInputChange}>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Planned">Planned</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (Total Time)</label>
                                        <input type="text" name="duration" className="form-control" value={formData.duration || ''} onChange={handleInputChange} placeholder="e.g. 6 Months" />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlight 1 Label</label>
                                        <input type="text" name="goalsLabel" className="form-control" value={formData.goalsLabel || 'Core Goal'} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlight 1 Value</label>
                                        <input type="text" name="goals" className="form-control" value={formData.goals || ''} onChange={handleInputChange} placeholder="Brief summary of goal" />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlight 2 Label</label>
                                        <input type="text" name="beneficiariesLabel" className="form-control" value={formData.beneficiariesLabel || 'Beneficiaries'} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlight 2 Value</label>
                                        <input type="text" name="beneficiaries" className="form-control" value={formData.beneficiaries || ''} onChange={handleInputChange} placeholder="e.g. 200+ Rural Women" />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlight 3 Label</label>
                                        <input type="text" name="impactLabel" className="form-control" value={formData.impactLabel || 'Total Impact'} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlight 3 Value</label>
                                        <input type="text" name="impact" className="form-control" value={formData.impact || ''} onChange={handleInputChange} placeholder="e.g. 50% better health" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Main Image (URL or Upload)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="text" name="image" className="form-control" value={formData.image || ''} onChange={handleInputChange} placeholder="Paste image URL..." />
                                            <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <ImageIcon size={18} /> Upload
                                                <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'image')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Project Image Gallery (Upload multiple photos of progress)</label>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <label className="btn btn-primary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px', width: '100%', justifyContent: 'center' }}>
                                                <Plus size={18} /> Choose implementations photos from device
                                                <input type="file" multiple style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'images', true)} />
                                            </label>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                            {(formData.images || []).map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            const filtered = formData.images.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, images: filtered });
                                                        }}
                                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', border: 'none', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Detailed Project Description</label>
                                        <textarea name="description" className="form-control" rows="4" value={formData.description || ''} onChange={handleInputChange} />
                                    </div>
                                </>
                            )}
                            {activeTab === 'events' && (
                                <>
                                    <div className="form-group">
                                        <label>Event Name</label>
                                        <input type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" name="date" className="form-control" value={formData.date || ''} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Venue / Location</label>
                                        <input type="text" name="location" className="form-control" value={formData.location || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Project Category</label>
                                        <input type="text" name="category" className="form-control" value={formData.category || ''} onChange={handleInputChange} placeholder="e.g. Healthcare" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Full Event Description</label>
                                        <textarea name="description" className="form-control" rows="3" value={formData.description || ''} onChange={handleInputChange} placeholder="Describe the event goals and details..." />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Event Poster (Main Display)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="text" name="image" className="form-control" value={formData.image || ''} onChange={handleInputChange} placeholder="Paste poster URL..." />
                                            <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <ImageIcon size={18} /> Upload
                                                <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'image')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Event Gallery (Add Multiple Photos from Device or URL)</label>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input 
                                                type="text" 
                                                id="new-event-img"
                                                className="form-control" 
                                                placeholder="Paste image URL here..." 
                                            />
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    const input = document.getElementById('new-event-img');
                                                    if (input.value) {
                                                        const currentImages = formData.images || [];
                                                        setFormData({ ...formData, images: [...currentImages, input.value] });
                                                        input.value = '';
                                                    }
                                                }}
                                            >
                                                Add Link
                                            </button>
                                            <label className="btn btn-primary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Plus size={18} /> Upload Pics
                                                <input type="file" multiple style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'images', true)} />
                                            </label>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                            {(formData.images || []).map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            const filtered = formData.images.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, images: filtered });
                                                        }}
                                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', border: 'none', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'gallery' && (
                                <>
                                    <div className="form-group full-width">
                                        <label>Batch Device Upload (Select multiple photos to add at once)</label>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                                                <Plus size={20} /> Select Photos from Computer / Phone
                                                <input 
                                                    type="file" 
                                                    multiple 
                                                    style={{ display: 'none' }} 
                                                    onChange={async (e) => {
                                                       const files = Array.from(e.target.files);
                                                       if (files.length === 0) return;
                                                       
                                                       const projectVal = formData.project || 'General';
                                                       const categoryVal = formData.category || 'Images';
                                                       
                                                       const uploadFormData = new FormData();
                                                       files.forEach(file => uploadFormData.append('images', file));
                                                       
                                                       try {
                                                           const res = await fetch('http://localhost:5000/api/upload', {
                                                               method: 'POST',
                                                               body: uploadFormData
                                                           });
                                                           const result = await res.json();
                                                           if (result.success) {
                                                               // For gallery, we need to create multiple entries
                                                               for (const url of result.urls) {
                                                                   await fetch('http://localhost:5000/api/gallery', {
                                                                       method: 'POST',
                                                                       headers: { 'Content-Type': 'application/json' },
                                                                       body: JSON.stringify({
                                                                           url,
                                                                           project: projectVal,
                                                                           category: categoryVal,
                                                                           type: 'image'
                                                                       })
                                                                   });
                                                               }
                                                               fetchData(); // Refresh list
                                                               handleCloseModal();
                                                               alert(`Successfully uploaded ${result.urls.length} photos!`);
                                                           }
                                                       } catch (err) { console.error(err); }
                                                    }} 
                                                />
                                            </label>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '5px' }}>
                                                Tip: Set the "Specific Project" field below before uploading.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Single Photo URL (Optional)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="text" name="url" className="form-control" value={formData.url || ''} onChange={handleInputChange} placeholder="Paste single URL..." />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Specific Project / Album Name</label>
                                        <input type="text" name="project" className="form-control" value={formData.project || ''} onChange={handleInputChange} placeholder="e.g. Health Camp 2024" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select name="category" className="form-control" value={formData.category || 'Images'} onChange={handleInputChange}>
                                            <option value="Images">Images</option>
                                            <option value="Celebrations">Celebrations</option>
                                            <option value="Inauguration">Inauguration</option>
                                            <option value="Drives">Drives</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            {activeTab === 'banners' && (
                                <>
                                    <div className="form-group">
                                        <label>Announcement Type</label>
                                        <select name="type" className="form-control" value={formData.type || 'popup'} onChange={handleInputChange}>
                                            <option value="popup">Important Popup</option>
                                            <option value="floating">Sidebar Bubble</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Headline</label>
                                        <input type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Highlight Message</label>
                                        <textarea name="text" className="form-control" value={formData.text || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Redirect To (Select Page)</label>
                                        <select name="link" className="form-control" value={formData.link || ''} onChange={handleInputChange}>
                                            <option value="">No Redirect (Info Only)</option>
                                            <option value="/">Home Page</option>
                                            <option value="/about">About Us</option>
                                            <option value="/projects">All Projects</option>
                                            <option value="/events">All Events</option>
                                            <option value="/gallery">Media Gallery</option>
                                            <option value="/contact">Contact Page</option>
                                            <optgroup label="Direct Project Links">
                                                {data.projects.map(p => (
                                                    <option key={p.id} value={`/projects/${p.id}`}>{p.title}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Direct Event Links">
                                                {data.events.map(e => (
                                                    <option key={e.id} value={`/events/${e.id}`}>{e.title}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Popup Display Image</label>
                                        <div style={{ padding: '20px', border: '2px dashed var(--border)', borderRadius: '15px', textAlign: 'center', background: '#f9fbfd' }}>
                                            {formData.image ? (
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img src={formData.image} alt="Preview" style={{ maxHeight: '200px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                    <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="btn btn-secondary" style={{ position: 'absolute', top: '-10px', right: '-10px', borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}>X</button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                                    <div style={{ color: 'var(--text-light)' }}>
                                                        <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                                        <p>Choose a banner photo to grab attention</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                                            <Plus size={18} /> From Device
                                                            <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'image')} />
                                                        </label>
                                                        <button type="button" className="btn btn-outline-primary" onClick={() => {
                                                            const url = prompt('Enter Image URL:');
                                                            if (url) setFormData({ ...formData, image: url });
                                                        }}>
                                                            Paste URL
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Active</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '100%' }}>
                                            <input type="checkbox" name="active" checked={formData.active || false} onChange={handleInputChange} style={{ width: '20px', height: '20px' }} />
                                            <span>Display on site</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'stats' && (
                                <>
                                    <div className="form-group">
                                        <label>Metric Label</label>
                                        <input type="text" name="label" className="form-control" value={formData.label || ''} onChange={handleInputChange} required placeholder="e.g. Children Taught" />
                                    </div>
                                    <div className="form-group">
                                        <label>Numerical Value</label>
                                        <input type="text" name="value" className="form-control" value={formData.value || ''} onChange={handleInputChange} required placeholder="e.g. 500+" />
                                    </div>
                                    <div className="form-group">
                                        <label>Icon Identifier</label>
                                        <select name="icon" className="form-control" value={formData.icon || 'users'} onChange={handleInputChange}>
                                            <option value="users">People / Users</option>
                                            <option value="globe">Global / Regions</option>
                                            <option value="heart">Heart / Impact</option>
                                            <option value="star">Star / Awards</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="form-actions full-width" style={{ marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                                    <Save size={18} /> {editingItem ? 'Save Changes' : 'Publish Now'}
                                </button>
                                <button type="button" className="btn btn-outline-primary" onClick={handleCloseModal}>Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
