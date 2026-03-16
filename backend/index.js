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

// Mongoose Models
const projectSchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    goals: String,
    impact: String,
    status: String,
    beneficiaries: String,
    duration: String,
    image: String,
    images: [String]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const gallerySchema = new mongoose.Schema({
    url: String,
    type: String,
    project: String,
    category: String
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    location: String,
    category: String,
    description: String,
    image: String,
    images: [String]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

const bannerSchema = new mongoose.Schema({
    type: String,
    title: String,
    text: String,
    active: Boolean,
    image: String,
    link: String
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

const statSchema = new mongoose.Schema({
    label: String,
    value: String,
    icon: String
}, { timestamps: true });

const Stat = mongoose.model('Stat', statSchema);

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        
        // Initial Data Seed (Only if collections are empty)
        const seedData = async () => {
            const count = await Project.countDocuments();
            if (count === 0) {
                await Project.create([
                    {
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
                ]);
                await Gallery.create([
                    { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', type: 'image', project: 'Education', category: 'Drives' },
                    { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', type: 'image', project: 'Community', category: 'Celebrations' },
                    { url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800', type: 'image', project: 'Women Empowerment', category: 'Inauguration' }
                ]);
                await Event.create([
                    { title: 'Annual Health Camp 2024', date: '2024-05-15', location: 'Gwalior', category: 'Healthcare', description: 'Free medical checkup for rural residents.', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800', images: [] }
                ]);
                await Banner.create([
                    { type: 'popup', title: 'Healthcare Drive', text: 'Join our upcoming community health checkup program!', active: true, image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800' },
                    { type: 'floating', title: 'New Project Alert', text: 'Clean Water Project Phase 2 launched.', active: true, link: '/projects' }
                ]);
                await Stat.create([
                    { label: 'Lives Impacted', value: '10k+', icon: 'users' },
                    { label: 'Active Regions', value: '15+', icon: 'globe' },
                    { label: 'Projects Done', value: '25+', icon: 'heart' }
                ]);
                console.log("Database seeded successfully");
            }
        };
        seedData();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// API Routes
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

// Generic CRUD utility for Mongoose
const setupRoutes = (path, Model) => {
    app.get(`/api/${path}`, async (req, res) => {
        try {
            const items = await Model.find().sort({ createdAt: -1 });
            res.json(items);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.post(`/api/${path}`, async (req, res) => {
        try {
            const item = new Model(req.body);
            const savedItem = await item.save();
            res.json(savedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    app.put(`/api/${path}/:id`, async (req, res) => {
        try {
            const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    app.delete(`/api/${path}/:id`, async (req, res) => {
        try {
            await Model.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
};

setupRoutes('projects', Project);
setupRoutes('gallery', Gallery);
setupRoutes('events', Event);
setupRoutes('banners', Banner);
setupRoutes('stats', Stat);

app.post('/api/contact', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.json({ message: 'Success' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
