const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'frontend', 'public', 'images', 'all');
const files = fs.readdirSync(imageDir).filter(f => f.toLowerCase().match(/\.(jpg|jpeg|png|mp4)$/));

const allImages = files.map(f => `/images/all/${f}`);

// Categorize images based on filenames
const envImages = [];
const healthImages = [];
const reliefImages = [];
const ashramImages = [];

for (const url of allImages) {
    if (url.includes('IMG-20251005')) {
        envImages.push(url);
    } else if (url.includes('IMG-20260409-WA')) {
        const match = url.match(/WA(\d+)/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num <= 50) {
                healthImages.push(url); // Hospital checks, eye camps
            } else if (num > 50 && num <= 300) {
                reliefImages.push(url); // Street distribution, night blankets
            } else if (num > 300) {
                ashramImages.push(url); // Ashram Swarg Sadan
            } else {
                reliefImages.push(url);
            }
        }
    } else {
        ashramImages.push(url); // Default catch-all
    }
}

const staticProjects = [
  {
    _id: 'p1',
    title: 'Ashram Swarg Sadan Support',
    location: 'Gwalior',
    description: 'A dedicated initiative to support "Ashram Swarg Sadan" - a home for the homeless, unclaimed people, and elderly. We provide continuous support through food distribution, essential supplies, and spending quality time with the residents.',
    goals: 'Dignity & Care for All',
    impact: '100+ Residents Supported',
    status: 'Ongoing',
    beneficiaries: 'Elderly & Homeless',
    duration: 'Continuous',
    image: ashramImages[0] || '/images/projects/relief.jpg',
    images: ashramImages
  },
  {
    _id: 'p2',
    title: 'Night Rescue & Street Relief',
    location: 'Urban Streets & Bridges',
    description: 'Quick response and consistent support for the most vulnerable living on the streets. Our teams go out during nighttime to distribute warm food, blankets, and clothing to homeless individuals and daily wage earners.',
    goals: 'Zero Hunger & Cold Relief',
    impact: 'Daily nourishment',
    status: 'Active',
    beneficiaries: 'Homeless & Nomads',
    duration: 'Nightly',
    image: reliefImages[0] || '/images/projects/relief.jpg',
    images: reliefImages
  },
  {
    _id: 'p3',
    title: 'Healthcare & Medical Assistance',
    location: 'Hospitals & Rural Camps',
    description: 'Providing essential healthcare services, free medical camps, and direct assistance in hospital wards. Activities include free cataract surgeries, asthma checkups, and distributing food to patients and their families.',
    goals: 'Accessible Medical Care',
    impact: 'Thousands treated',
    status: 'Active',
    beneficiaries: 'Underprivileged Patients',
    duration: 'Ongoing',
    image: healthImages[0] || '/images/projects/health.jpg',
    images: healthImages
  },
  {
    _id: 'p4',
    title: 'Environmental Conservation',
    location: 'Gwalior & Surrounding Areas',
    description: 'A dedicated initiative to restore biodiversity and improve air quality through massive plantation drives. We have planted hundreds of saplings with the help of local volunteers to combat climate change.',
    goals: 'Increase Green Cover',
    impact: 'Improved Ecosystem',
    status: 'Ongoing',
    beneficiaries: 'Local Community',
    duration: 'Since 2025',
    image: envImages[0] || '/images/projects/environment.jpg',
    images: envImages
  }
];

const staticGallery = allImages.map((url, idx) => {
    let category = 'General';
    let project = 'General Initiatives';

    if (envImages.includes(url)) { category = 'Environmental'; project = 'Plantation Drive'; }
    else if (healthImages.includes(url)) { category = 'Healthcare'; project = 'Medical Assistance'; }
    else if (reliefImages.includes(url)) { category = 'Relief Support'; project = 'Street Relief'; }
    else if (ashramImages.includes(url)) { category = 'Elder Care'; project = 'Ashram Swarg Sadan'; }

    return { id: `g${idx}`, url, project, category };
});

const content = `
export const staticProjects = ${JSON.stringify(staticProjects, null, 2)};
export const staticGallery = ${JSON.stringify(staticGallery, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'data', 'staticData.js'), content);
console.log('Successfully generated staticData.js with ' + allImages.length + ' images.');
