require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const itineraryRoutes = require('./routes/itinerary');
const commentRoutes = require('./routes/comments');
const checklistRoutes = require('./routes/checklists');
const fileRoutes = require('./routes/files');
const reservationRoutes = require('./routes/reservations');
const expenseRoutes = require('./routes/expenses');

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://trip-sync-apk.vercel.app',
  'https://trip-sync-self.vercel.app',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/trips/:tripId/itinerary', itineraryRoutes);
app.use('/api/v1/trips/:tripId/comments', commentRoutes);
app.use('/api/v1/trips/:tripId/checklists', checklistRoutes);
app.use('/api/v1/trips/:tripId/files', fileRoutes);
app.use('/api/v1/trips/:tripId/reservations', reservationRoutes);
app.use('/api/v1/trips/:tripId/expenses', expenseRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'TripSync API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TripSync API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
