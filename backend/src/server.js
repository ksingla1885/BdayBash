import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import wishRoutes from './routes/wishRoutes.js';

// Do not connect at top level, use middleware instead
// connectDB();

const app = express();

const extractOrigin = (url) => {
  if (!url) return null;
  try {
    const { protocol, host } = new URL(url);
    return `${protocol}//${host}`;
  } catch {
    return url.replace(/\/$/, ""); // Fallback to stripping trailing slash
  }
};

const allowedOrigins = [
  'http://localhost:5173',
  'https://hbd-bash.vercel.app',
  'https://bday-bash.vercel.app', // added commonly used name
  'https://bday-bash.now.sh',
  extractOrigin(process.env.CLIENT_URL),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // Check for exact matches
    const isAllowed = allowedOrigins.some(ao => ao && (origin === ao || origin === ao.replace(/\/$/, '')));

    if (isAllowed || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed in middleware:', err);
    res.status(500).json({ error: 'Database connection failed. Please check your MONGO_URI.' });
  }
});

// Routes
app.use('/api/wish', wishRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎂 BdayBash API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: String(err.message || err.toString() || 'Internal server error') });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
