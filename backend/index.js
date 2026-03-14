const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const ADMIN_ID = "gt-admin";
const ADMIN_PASS = "Gyanteerth@2024&#";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/upload', upload.array('images'), (req, res) => {
    const urls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    res.json({ success: true, urls });
});

app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    if (id === ADMIN_ID && password === ADMIN_PASS) {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// In-memory data store
let projects = [
    {
        id: 1,
        title: 'Clean Water Initiative',
        location: 'Rural India',
        description: 'Providing clean drinking water to over 5000 families across 15 villages by installing solar-powered community water filters.',
        goals: 'Zero waterborne diseases',
        impact: '5000 families helped',
        status: 'Ongoing',
        beneficiaries: 'Underprivileged Rural Families',
        duration: '2 Years',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
        images: []
    },
    {
        id: 2,
        title: 'Education for All',
        location: 'Urban Slums',
        description: 'Running free evening classes and digital literacy workshops for children who have dropped out of school in urban areas.',
        goals: '100% literacy rate in targeted areas',
        impact: '400 kids enrolled',
        status: 'Completed',
        beneficiaries: 'Slum Children',
        duration: '1 Year',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
        images: []
    }
];

let gallery = [
    { id: 1, url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', type: 'image', project: 'Education', category: 'Drives' },
    { id: 2, url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', type: 'image', project: 'Community', category: 'Celebrations' },
    { id: 3, url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800', type: 'image', project: 'Women Empowerment', category: 'Inauguration' }
];

let events = [
    { id: 1, title: 'Annual Health Camp 2024', date: '2024-05-15', location: 'Gwalior', category: 'Healthcare', description: 'Free medical checkup for rural residents.', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800', images: [] }
];

let banners = [
    { id: 1, type: 'popup', title: 'Healthcare Drive', text: 'Join our upcoming community health checkup program!', active: true, image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800' },
    { id: 2, type: 'floating', title: 'New Project Alert', text: 'Clean Water Project Phase 2 launched.', active: true, link: '/projects' }
];

let stats = [
    { id: 1, label: 'Lives Impacted', value: '10k+', icon: 'users' },
    { id: 2, label: 'Active Regions', value: '15+', icon: 'globe' },
    { id: 3, label: 'Projects Done', value: '25+', icon: 'heart' }
];

let messages = [];

// Helper to handle CRUD routing
const crud = (path, store) => {
    app.get(`/api/${path}`, (req, res) => res.json(store));
    app.post(`/api/${path}`, (req, res) => {
        const item = { id: Date.now(), ...req.body };
        store.push(item);
        res.json(item);
    });
    app.put(`/api/${path}/:id`, (req, res) => {
        const { id } = req.params;
        const index = store.findIndex(i => i.id === parseInt(id));
        if (index !== -1) {
            store[index] = { ...store[index], ...req.body };
            res.json(store[index]);
        } else res.status(404).json({ message: 'Not found' });
    });
    app.delete(`/api/${path}/:id`, (req, res) => {
        const { id } = req.params;
        const index = store.findIndex(i => i.id === parseInt(id));
        if (index !== -1) {
            store.splice(index, 1);
            res.json({ message: 'Deleted' });
        } else res.status(404).json({ message: 'Not found' });
    });
};

crud('projects', projects);
crud('gallery', gallery);
crud('events', events);
crud('banners', banners);
crud('stats', stats);



app.post('/api/contact', (req, res) => {
    messages.push({ id: Date.now(), ...req.body });
    res.json({ message: 'Success' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
