import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import dotenv from 'dotenv';
import helmet from 'helmet';
import { initDB } from '../config/db.js'; // Adjust path if needed
import { syncDB } from '../config/db.js'; // Adjust path if needed
import { apiKeyMiddleware } from '../middleware/apiKey.js'; // Adjust path based on your structure
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js'; // Adjust path

import loginRouter from '../routes/user/loginRoutes.js';

// Import models here so they register automatically
import {AllowedEmail, User} from "../models/relations.js"; 

dotenv.config();
const app = express();
app.set('trust proxy', 1);

// Load allowed origins from env (comma-separated), fallback for dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
      'http://localhost:5173',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
    ];

// CORS configuration with origin validation
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 200,
};

if (process.env.NODE_ENV === "prod") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "prod",
}));
app.use(cors(corsOptions));

// Use API Key validation middleware (applies globally; move to specific routes if needed)
app.use(apiKeyMiddleware);

// Example routes (add your actual routes here)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: process.env.NODE_ENV });
});

// Example protected route using Firebase token verification
app.get('/protected', verifyFirebaseToken, (req, res) => {
  res.status(200).json({ message: 'Protected content', user: req.user });
});

//Login Routes
app.use("/user",loginRouter);

// Global error handler (should be last)
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error: Origin not allowed' });
  }
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

(async () => {
  await initDB();
  await syncDB();
})();

const port = process.env.PORT || 3500;

if (process.env.NODE_ENV === 'dev') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// For Vercel
export default app;