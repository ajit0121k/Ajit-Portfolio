import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import config from '../config/env.js';

async function seedResume() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB for resume ingestion...');

    // 1. Update Profile
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    profile.name = 'Ajit Kumar';
    profile.title = 'Full Stack Developer & AI Engineer';
    profile.tagline = 'Skilled in MERN Stack (MongoDB, Express, React, Node.js), GenAI, and Scalable Cloud Systems';
    profile.bio = '<p>Full Stack Developer skilled in the <strong>MERN stack</strong> (MongoDB, Express.js, React.js, Node.js), JWT authentication, and Role-Based Access Control (RBAC). Experienced in deploying applications to production and integrating Generative AI & NLP models. Passionate about building robust, scalable, and secure web applications.</p>';
    profile.location = 'Lucknow, India';
    profile.yearsOfExperience = 2;
    profile.email = 'ajitkumar2956654@gmail.com';
    profile.phone = '+91 7379247197';
    profile.profileImage = { url: '/profile.jpg', publicId: 'local_profile_pic' };
    profile.availability = 'available';
    profile.availabilityText = 'Available for Full-Time Roles & Internships';
    profile.currentlyBuilding = 'AI Startup Trend Analyzer';
    profile.currentlyBuildingUrl = 'https://github.com/ajit0121k';
    profile.socialLinks = {
      github: 'https://github.com/ajit0121k',
      linkedin: 'https://www.linkedin.com/in/ajit-kumar-a3a16b2b0/',
      twitter: '',
      website: '',
    };
    profile.seo = {
      title: 'Ajit Kumar | Full Stack MERN Developer & AI Engineer',
      description: 'Portfolio of Ajit Kumar - Full Stack MERN Developer skilled in React, Node.js, Express, MongoDB, and Generative AI.',
      keywords: ['Ajit Kumar', 'MERN Stack Developer', 'React.js', 'Node.js', 'Generative AI', 'Full Stack Developer Lucknow'],
    };
    await profile.save();
    console.log('Profile updated successfully!');

    // 2. Populate Work Experience
    await Experience.deleteMany({});
    await Experience.create([
      {
        role: 'Generative AI Intern',
        company: 'IBM SkillsBuild (in collab with AICTE / Edunet)',
        employmentType: 'Internship',
        location: 'Virtual',
        startDate: new Date('2026-06-01'),
        current: true,
        description: '<p>Completed hands-on modules in Artificial Intelligence, Machine Learning, and Large Language Models. Explored prompt engineering, NLP concepts, and AI applications using IBM Watson and Cloud tools.</p>',
        technologies: ['Generative AI', 'LLMs', 'Prompt Engineering', 'IBM Watson', 'NLP', 'Python'],
        order: 1,
        visible: true,
      },
      {
        role: 'Software Development Program',
        company: 'Unnesa Foundation',
        employmentType: 'Full-time',
        location: 'Virtual',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-07-01'),
        current: false,
        description: '<p>Selected for rigorous software development training recognizing academic merit and technical aptitude. Covered software engineering fundamentals, problem-solving, and modern practices.</p>',
        technologies: ['Problem Solving', 'Data Structures', 'Algorithms', 'Software Engineering'],
        order: 2,
        visible: true,
      },
      {
        role: 'Software Development Intern',
        company: "JP Morgan's",
        employmentType: 'Internship',
        location: 'Virtual',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-01-01'),
        current: false,
        description: '<p>Developed and optimized software solutions using Java and Python. Implemented data structures and performed debugging and testing to enhance application efficiency while contributing to collaborative Git workflows.</p>',
        technologies: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Git', 'Testing'],
        order: 3,
        visible: true,
      },
    ]);
    console.log('Experience records created!');

    // 3. Populate Projects
    await Project.deleteMany({});
    await Project.create([
      {
        title: 'Startup Trend Analyzer',
        slug: 'startup-trend-analyzer',
        shortDescription: 'Full-stack AI-based web application that analyzes real-time data from GitHub, tech news, and online sources to identify emerging trends and startup opportunities.',
        problem: '<p>Entrepreneurs and investors struggle to identify emerging technology waves across disparate data sources without automated sentiment analysis and opportunity scoring.</p>',
        solution: '<p>Built a full-stack AI web platform integrating Python (FastAPI), React, and PostgreSQL. Utilizes NLP and machine learning techniques for sentiment analysis, trend detection, and automated startup opportunity generation.</p>',
        architecture: '<p>FastAPI backend with PostgreSQL data processing layer and responsive React frontend dashboard for real-time visualization.</p>',
        features: [
          'Real-time data ingestion from GitHub and tech news APIs',
          'NLP and sentiment analysis for trend detection',
          'Automated startup opportunity generation with scoring',
          'Interactive React dashboard with PostgreSQL processing',
        ],
        technologies: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'NLP', 'Machine Learning', 'Tailwind CSS'],
        githubUrl: 'https://github.com/ajit0121k',
        liveUrl: '',
        featured: true,
        pinned: true,
        status: 'published',
        order: 1,
        publishedAt: new Date('2025-11-01'),
      },
      {
        title: 'Network Monitoring Application (Web-Based)',
        slug: 'network-monitoring-application',
        shortDescription: 'Web-based network monitoring dashboard to track real-time bandwidth, latency, and device status with automated anomaly alerts.',
        problem: '<p>Administrators need centralized, instant visibility into network performance, bandwidth spikes, and offline devices with proactive alerting.</p>',
        solution: '<p>Developed a full-stack real-time network dashboard tracking latency, bandwidth metrics, and historical logs with alert notifications for anomalies.</p>',
        architecture: '<p>Event-driven Node.js backend with WebSocket telemetry streaming to a responsive React frontend.</p>',
        features: [
          'Real-time bandwidth and latency tracking',
          'Device status health monitoring',
          'Automated anomaly alerts & notifications',
          'Historical performance logging and charts',
        ],
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'WebSockets', 'Chart.js', 'Tailwind CSS'],
        githubUrl: 'https://github.com/ajit0121k',
        liveUrl: '',
        featured: true,
        pinned: true,
        status: 'published',
        order: 2,
        publishedAt: new Date('2026-05-01'),
      },
      {
        title: 'Diet Planner – DietGuide',
        slug: 'diet-planner-dietguide',
        shortDescription: 'React-based gym diet planner featuring subscription tiers, per-user data scoping, and Recharts-powered analytics for fitness progress tracking.',
        problem: '<p>Gym-goers lack structured meal planning with macro tracking and progress visualization scoped securely to individual accounts.</p>',
        solution: '<p>Built DietGuide with multi-tier subscription access, user isolation, meal scheduling, and Recharts analytics.</p>',
        features: [
          'Personalized gym diet meal planning',
          'Subscription tiers & role-based scoping',
          'Recharts-powered macro and weight analytics',
          'Responsive mobile-first user interface',
        ],
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Recharts', 'Tailwind CSS'],
        githubUrl: 'https://github.com/ajit0121k',
        liveUrl: '',
        featured: true,
        pinned: false,
        status: 'published',
        order: 3,
        publishedAt: new Date('2026-06-01'),
      },
      {
        title: 'Full-Stack Developer Portfolio & CMS',
        slug: 'developer-portfolio-cms',
        shortDescription: 'Production-ready MERN developer portfolio with full SaaS Admin CMS, Liquid Glass UI, and real-time MongoDB synchronization.',
        problem: '<p>Static portfolios require code modifications for every update and lack centralized admin control, live previews, and analytics.</p>',
        solution: '<p>Engineered a complete data-driven portfolio CMS with JWT authentication, TipTap rich text, drag-and-drop management, and frosted glass responsive design.</p>',
        features: [
          'SaaS Admin CMS with full CRUD across all sections',
          'Liquid Glass responsive UI inspired by modern design trends',
          'Command Palette (Ctrl+K) for instant navigation',
          'Dynamic XML sitemap, robots.txt, and privacy-conscious analytics',
        ],
        technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'TipTap'],
        githubUrl: 'https://github.com/ajit0121k',
        liveUrl: 'http://localhost:5173',
        featured: true,
        pinned: false,
        status: 'published',
        order: 4,
        publishedAt: new Date('2025-03-01'),
      },
    ]);
    console.log('Projects created!');

    // 4. Populate Skills
    await Skill.deleteMany({});
    await Skill.create([
      // Frontend
      { name: 'React.js', category: 'Frontend', proficiency: 92, years: 2, order: 1, visible: true },
      { name: 'Next.js', category: 'Frontend', proficiency: 85, years: 1, order: 2, visible: true },
      { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 90, years: 2, order: 3, visible: true },
      { name: 'HTML5 & CSS3', category: 'Frontend', proficiency: 95, years: 2, order: 4, visible: true },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, years: 2, order: 5, visible: true },

      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 88, years: 2, order: 1, visible: true },
      { name: 'Express.js', category: 'Backend', proficiency: 90, years: 2, order: 2, visible: true },
      { name: 'Python', category: 'Backend', proficiency: 82, years: 2, order: 3, visible: true },
      { name: 'Java', category: 'Backend', proficiency: 80, years: 2, order: 4, visible: true },
      { name: 'RESTful APIs', category: 'Backend', proficiency: 90, years: 2, order: 5, visible: true },

      // Database
      { name: 'MongoDB', category: 'Database', proficiency: 90, years: 2, order: 1, visible: true },
      { name: 'PostgreSQL', category: 'Database', proficiency: 80, years: 1, order: 2, visible: true },
      { name: 'SQL', category: 'Database', proficiency: 85, years: 2, order: 3, visible: true },

      // DevOps & Tools
      { name: 'Git & GitHub', category: 'DevOps', proficiency: 90, years: 2, order: 1, visible: true },
      { name: 'Generative AI & LLMs', category: 'Tools', proficiency: 85, years: 1, order: 2, visible: true },
      { name: 'Data Structures & OOP', category: 'Tools', proficiency: 88, years: 2, order: 3, visible: true },
      { name: 'Power BI', category: 'Tools', proficiency: 75, years: 1, order: 4, visible: true },
      { name: 'JWT & RBAC Auth', category: 'Tools', proficiency: 90, years: 2, order: 5, visible: true },
    ]);
    console.log('Skills populated!');

    // 5. Populate Education
    await Education.deleteMany({});
    await Education.create([
      {
        degree: 'B.Tech, Computer Science & Engineering',
        institution: 'APJ Abdul Kalam Technological University',
        startYear: 2023,
        endYear: 2027,
        location: 'Lucknow, India',
        description: 'Pursuing Bachelor of Technology in Computer Science & Engineering. Rigorous coursework in Data Structures, Algorithms, Operating Systems, Computer Networks, and DBMS.',
        order: 1,
        visible: true,
      },
      {
        degree: 'Secondary Education (Class X)',
        institution: 'St. Theresa High School, UP Board',
        startYear: 2019,
        endYear: 2020,
        grade: '83.00%',
        location: 'Lucknow, India',
        description: 'Completed Secondary School Certificate with distinction in Mathematics and Sciences.',
        order: 2,
        visible: true,
      },
    ]);
    console.log('Education populated!');

    // 6. Populate Certifications
    await Certification.deleteMany({});
    await Certification.create([
      {
        name: 'Full Stack Development With MERN',
        issuingOrganization: 'NASSCOM Foundation',
        issueDate: new Date('2026-06-01'),
        credentialUrl: '',
        order: 1,
        visible: true,
      },
      {
        name: 'Full Stack Web Development',
        issuingOrganization: 'PW Skills',
        issueDate: new Date('2026-05-01'),
        credentialUrl: '',
        order: 2,
        visible: true,
      },
      {
        name: 'Generative AI For Developers',
        issuingOrganization: 'PW Skills',
        issueDate: new Date('2026-06-01'),
        credentialUrl: '',
        order: 3,
        visible: true,
      },
      {
        name: 'Data Analytics With AI',
        issuingOrganization: 'Sololearn',
        issueDate: new Date('2025-09-01'),
        credentialUrl: '',
        order: 4,
        visible: true,
      },
      {
        name: 'Certificate of Participation, Bhartiya Antariksh Hackathon',
        issuingOrganization: 'ISRO',
        issueDate: new Date('2025-05-01'),
        credentialUrl: '',
        order: 5,
        visible: true,
      },
      {
        name: 'What Is Software Development?',
        issuingOrganization: 'SIMPLILEARN',
        issueDate: new Date('2025-09-01'),
        credentialUrl: '',
        order: 6,
        visible: true,
      },
      {
        name: 'Visualize Your Data',
        issuingOrganization: 'Sololearn',
        issueDate: new Date('2025-04-01'),
        credentialUrl: '',
        order: 7,
        visible: true,
      },
      {
        name: 'Certificate of Recognition',
        issuingOrganization: 'Amigo India, Lucknow',
        issueDate: new Date('2024-10-01'),
        credentialUrl: '',
        order: 8,
        visible: true,
      },
    ]);
    console.log('Certifications populated!');

    await mongoose.disconnect();
    console.log('All resume data successfully synchronized into MongoDB!');
  } catch (err) {
    console.error('Error during resume seeding:', err);
    process.exit(1);
  }
}

seedResume();
