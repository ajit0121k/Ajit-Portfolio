# 🌟 Ajit Portfolio - Full-Stack Developer Portfolio & CMS

A modern, high-performance **Full-Stack Developer Portfolio & Content Management System (CMS)** built with **React 18, Tailwind CSS, Vite, Node.js, Express, and MongoDB**.

Featuring a custom 3D liquid glass / claymorphic user interface, dark and light mode presets, interactive widgets, live telemetry, and an admin CMS control center.

---

## ✨ Features

### 🌐 Public Portfolio Website
- **3D Liquid Glass & Claymorphic Aesthetic**: Ambient terracotta and sage glowing backgrounds with smooth micro-interactions and animations.
- **Dynamic Profile & Hero**: Live availability badges, animated tech stack pills, and bio presentation.
- **Projects Showcase**: Case study deep-dives with architecture breakdowns, problem/solution analysis, live demo links, and GitHub repositories.
- **Interactive Skills Matrix**: Grouped by category (Programming, Frontend, Backend, Database, DevOps, Cloud, Tools) with animated proficiency indicators.
- **Experience & Education Timelines**: Detailed career milestones, responsibilities, and academic background.
- **Verified Certifications & Testimonials**: Showcasing credentials and client endorsements with 5-star ratings.
- **Interactive Resume / CV Viewer**: Inline PDF reader, active version download, and instant preview.
- **Contact & Inquiries**: Real-time message form with rate limiting, email delivery, and automated replies.
- **Maintenance Mode**: Scheduled maintenance screen with live status checker and direct email contact cards.

### 🛡️ Admin CMS Control Panel
- **Comprehensive Dashboard**: Real-time traffic analytics, project view trends, unread inquiry counters, and profile completeness metrics.
- **Profile Manager**: Dynamic bio editing, social link management, avatar upload, and personal branding.
- **Resume Manager**: Upload, activate, preview, and delete resume versions with automatic profile synchronization.
- **Projects CRUD**: Full case-study management, cover images, gallery uploads, tech tags, draft/published statuses, and ordering.
- **Skills CRUD**: Category assignment, proficiency sliders, and visibility toggles.
- **Experience & Education CRUD**: Company roles, employment types, degree entries, and chronological sorting.
- **Certifications & Testimonials CRUD**: Credential validation links, client quotes, and badge media.
- **Messages Inbox**: Inquiry viewer, read/unread toggles, archive, direct email replying, and audit logging.
- **Media Library**: Multi-file asset upload, image/document preview, URL copying, and asset deletion.
- **Site Settings**: Theme customization (presets & accent colors), section visibility toggles, contact form configuration, and maintenance mode controls.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, Custom Glassmorphic & Claymorphic CSS utilities
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: Zustand (with persistence)
- **Rich Text Editor**: TipTap / Custom Rich Text Component
- **Notifications**: React Hot Toast
- **Data Visualization**: Recharts

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh Tokens) with HTTP-only cookies
- **Validation**: Zod Schema Validation
- **File Storage**: Local filesystem + Cloudinary integration support
- **Security**: Helmet, CORS, Express Mongo Sanitize, Rate Limiters

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster
- **npm** or **yarn**

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ajit0121k/Ajit-Portfolio.git
   cd Ajit-Portfolio
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   *Alternatively, install individually:*
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

---

### Environment Variables

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Initial Admin Credentials (used for initial seed)
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=YourSecurePassword123!

# Cloudinary (Optional - file storage fallback to local uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP Email Configuration (Optional - for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@yourportfolio.com
EMAIL_TO=your_email@example.com
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory (optional for local development):
```env
VITE_API_URL=/api
```

---

### Running the Application

1. **Start the Backend Server (Port 5000):**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Vite Server (Port 5173):**
   ```bash
   cd client
   npm run dev
   ```

3. **Open in Browser:**
   - **Public Portfolio**: [http://localhost:5173](http://localhost:5173)
   - **Admin CMS Panel**: [http://localhost:5173/admin](http://localhost:5173/admin)
   - **Backend API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📦 Building for Production

To build the client application for production:
```bash
cd client
npm run build
```
The optimized static assets will be output to `client/dist/`.

---

## 🔒 Security Best Practices
- Passwords hashed with bcrypt.
- Rate limiting applied on auth, contact, and upload endpoints.
- NoSQL injection prevention with mongo-sanitize.
- Environment variables containing secrets are strictly excluded via `.gitignore`.

---

## 👤 Author
**Ajit Kumar**
- GitHub: [@ajit0121k](https://github.com/ajit0121k)

---

## 📄 License
This project is licensed under the MIT License.
