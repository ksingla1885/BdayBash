import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import wishRoutes from './routes/wishRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const extractOrigin = (url) => {
  if (!url) return null;
  try {
    const { protocol, host } = new URL(url);
    return `${protocol}//${host}`;
  } catch {
    return url.replace(/\/$/, ""); 
  }
};

const allowedOrigins = [
  'http://localhost:5173',
  'https://hbd-bash.vercel.app',
  'https://bday-bash.vercel.app', 
  'https://bday-bash.now.sh',
  extractOrigin(process.env.CLIENT_URL),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(ao => ao && (origin === ao || origin === ao.replace(/\/$/, '')));
    if (isAllowed || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Being more permissive for development/socket convenience
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Initialize Database

connectDB()
  .then(() => console.log('📁 Database connection established'))
  .catch(err => console.error('📁 Initial database connection failed:', err.message));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed.' });
  }
});


// Routes
app.use('/api/wish', wishRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🎂 BdayBash API is running!' });
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-wish', (slug) => {
    socket.join(slug);
    console.log(`User joined room: ${slug}`);
  });

  socket.on('send-reaction', ({ slug, emoji }) => {
    io.to(slug).emit('new-reaction', emoji);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
