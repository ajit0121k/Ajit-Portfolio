import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import corsOptions from './config/cors.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import ApiResponse from './utils/ApiResponse.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxies (Vite, Nginx, Render)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// CORS config
app.use(cors(corsOptions));

// Development logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Global Rate Limiter
app.use('/api', globalLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Static file serving for uploads dir
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Root endpoint
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Portfolio Backend API Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #141a16; color: #f5f0e8; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #1c251f; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px; max-width: 520px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center; }
          .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(73, 101, 77, 0.3); color: #86efac; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 18px; border: 1px solid rgba(134, 239, 172, 0.2); }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 10px #22c55e; }
          h1 { margin: 0 0 10px; font-size: 24px; color: #f5f0e8; }
          p { color: #a3a89f; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
          .actions { display: flex; flex-direction: column; gap: 12px; }
          .btn { display: block; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; transition: all 0.2s; }
          .btn-primary { background: #c66a3d; color: white; }
          .btn-primary:hover { background: #b2572b; }
          .btn-secondary { background: rgba(255,255,255,0.06); color: #f5f0e8; border: 1px solid rgba(255,255,255,0.12); }
          .btn-secondary:hover { background: rgba(255,255,255,0.12); }
          .info { margin-top: 20px; font-size: 12px; color: #787e74; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> Backend API Server is Live (Port 5000)</div>
          <h1>Portfolio Backend Running</h1>
          <p>This port is the <strong>REST API & Database Engine</strong>. To browse your actual visual portfolio website or manage the admin panel, click below:</p>
          <div class="actions">
            <a href="http://localhost:5173" class="btn btn-primary">🌐 View Public Portfolio Website (Port 5173)</a>
            <a href="http://localhost:5173/admin" class="btn btn-secondary">⚙️ Open Admin CMS Panel</a>
          </div>
          <div class="info">API JSON endpoints available under <code>/api/*</code></div>
        </div>
      </body>
      </html>
    `);
  }

  res.status(200).json({
    success: true,
    message: 'MERN Portfolio Backend API Server is Active 🚀',
    frontendUrl: config.clientUrl || 'http://localhost:5173',
    apiHealth: '/api/health',
    endpoints: {
      profile: '/api/profile',
      settings: '/api/settings/public',
      projects: '/api/projects/published',
      skills: '/api/skills/visible',
      experience: '/api/experience/visible',
      education: '/api/education/visible',
      certifications: '/api/certifications/visible',
      github: '/api/github/stats',
      messages: '/api/messages (POST)'
    }
  });
});

// Health check endpoint with live telemetry
app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  return ApiResponse.success(res, 200, 'Server healthy and synchronized', {
    status: 'online',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    timestamp: new Date().toISOString(),
    env: config.env,
  });
});

// Mount all API routes
app.use('/api', routes);

// 404 handler for any unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on backend server. Did you mean to visit the frontend application at http://localhost:5173 ?`,
  });
});

// Global error handling middleware
app.use(errorHandler);

export default app;
