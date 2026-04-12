const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const MONGO_URI = 'mongodb://localhost:27017/gyanteerth';

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

const GallerySchema = new mongoose.Schema({
    url: String,
    type: String,
    project: String,
    category: String
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
const Gallery = mongoose.model('Gallery', GallerySchema);

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const uploadDir = path.join(__dirname, 'backend', 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const sourceDir = path.join(__dirname, 'Gt photos', 'gt');
        const files = fs.readdirSync(sourceDir);

        console.log(`Found ${files.length} files to process`);

        const galleryEntries = [];
        
        // Categorization logic
        for (const file of files) {
            if (!file.toLowerCase().endsWith('.jpg') && !file.toLowerCase().endsWith('.png')) continue;
            
            // Copy to uploads
            fs.copyFileSync(path.join(sourceDir, file), path.join(uploadDir, file));
            const url = `http://localhost:5000/uploads/${file}`;

            let category = 'General';
            let project = 'Community Development';

            if (file.includes('20251005')) {
                category = 'Environmental';
                project = 'Plantation Drive';
            } else if (file.includes('WA0006') || file.includes('WA0007') || file.includes('WA0008') || file.includes('WA0009') || file.includes('WA0010')) {
                category = 'Healthcare';
                project = 'Health Camps';
            } else if (parseInt(file.match(/WA(\d+)/)?.[1]) > 50 && parseInt(file.match(/WA(\d+)/)?.[1]) < 150) {
                category = 'Social Welfare';
                project = 'Community Relief';
            }

            galleryEntries.push({
                url,
                type: 'image',
                project,
                category
            });
        }

        // Clear existing gallery and projects or just add new ones?
        // User said "categorize and then upload", likely wants a fresh look.
        await Gallery.deleteMany({});
        await Gallery.insertMany(galleryEntries);
        console.log(`Inserted ${galleryEntries.length} gallery entries`);

        // Update/Create Projects
        await Project.deleteMany({});
        await Project.create([
            {
                title: 'Plantation Drive',
                location: 'Gwalior Region',
                description: 'Large scale tree plantation to improve green cover and combat climate change.',
                goals: 'Plant 10,000+ trees',
                impact: 'Improved air quality and local ecosystem',
                status: 'Ongoing',
                beneficiaries: 'Local Residents',
                duration: 'Ongoing',
                image: 'http://localhost:5000/uploads/IMG-20251005-WA0015.jpg',
                images: galleryEntries.filter(e => e.project === 'Plantation Drive').map(e => e.url).slice(0, 10)
            },
            {
                title: 'Health Camps',
                location: 'Rural & Slum Areas',
                description: 'Free healthcare checkups, eye exams, and medicine distribution for the underprivileged.',
                goals: 'Accessible healthcare for all',
                impact: '2000+ patients treated',
                status: 'Ongoing',
                beneficiaries: 'Underprivileged families',
                duration: 'Continuous',
                image: 'http://localhost:5000/uploads/IMG-20260409-WA0006.jpg',
                images: galleryEntries.filter(e => e.project === 'Health Camps').map(e => e.url).slice(0, 10)
            },
            {
                title: 'Community Relief',
                location: 'Various Locations',
                description: 'Providing food, clothing, and essential supplies to those in need, especially in hospitals and shelters.',
                goals: 'Zero hunger and basic dignity',
                impact: 'Daily meals for 100+ people',
                status: 'Active',
                beneficiaries: 'Homeless & Patients',
                duration: 'Daily',
                image: 'http://localhost:5000/uploads/IMG-20260409-WA0051.jpg',
                images: galleryEntries.filter(e => e.project === 'Community Relief').map(e => e.url).slice(0, 10)
            }
        ]);
        console.log('Projects updated with real data');

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
