// Fix DNS resolution for MongoDB Atlas SRV records
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const dotenv = require('dotenv');
// Load environment variables FIRST (before any route imports that use process.env)
// Only load .env.local in development; in production, Railway injects env vars directly
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const adminRoutes = require('./routes/admin.js');
const volunteerRoutes = require('./routes/volunteer.js');
const compression = require('compression');
const helmet = require('helmet');
const { setupSwagger } = require('./swagger.js');
const path = require('path');
const chatRoutes = require('./routes/chat');
const { initializeFirebase } = require('./services/firebaseService');

// Initialize Express App
const app = express();


// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5001',
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging middleware (minimal in production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Root route
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.json({
      message: 'Manas API',
      version: '1.1.0',
      status: 'Server is running'
    });
  }
  res.json({
    message: 'Welcome to Manas API (Socket.io Enabled)',
    version: '1.1.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verifyOTP: 'POST /api/auth/verify-otp',
        resendOTP: 'POST /api/auth/resend-otp'
      },
      user: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile'
      },
      chat: {
        history: 'GET /api/chat/history/:otherUserId'
      }
    },
    status: 'Server is running'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/chat', chatRoutes); // Register Chat Routes

// Setup Swagger API documentation (disabled in production)
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database test endpoint (disabled in production)
if (process.env.NODE_ENV !== 'production') {
  app.get('/test-db', async (req, res) => {
    try {
      const dbStatus = mongoose.connection.readyState;
      const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };

      res.status(200).json({
        status: 'ok',
        database: statusMap[dbStatus] || 'unknown',
        readyState: dbStatus
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });
}

// MongoDB — require a real URI in production (Railway has no local MongoDB)
const rawMongoUri = process.env.MONGODB_URI?.trim();
if (!rawMongoUri && process.env.NODE_ENV === 'production') {
  console.error(
    'CRITICAL: MONGODB_URI is missing. In Railway → Variables, set MONGODB_URI to your MongoDB Atlas connection string (mongodb+srv://...).'
  );
  process.exit(1);
}
const MONGODB_URI = rawMongoUri || 'mongodb://localhost:27017/manas';
const MONGODB_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true
};

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    console.log('Attempting to connect to MongoDB...');
    if (rawMongoUri) {
      const hint = rawMongoUri.startsWith('mongodb+srv')
        ? 'Atlas (SRV)'
        : rawMongoUri.includes('localhost')
          ? 'localhost'
          : 'custom URI';
      console.log('MongoDB URI: from environment (' + hint + ')');
    } else {
      console.warn(
        'MongoDB URI: not set in environment — using default mongodb://localhost:27017/manas (local dev only)'
      );
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    console.log('Connected to MongoDB successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please check your MONGODB_URI environment variable');
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Initialize Firebase (non-blocking)
initializeFirebase();

// Set port
const PORT = process.env.PORT || 5001;
console.log('Starting server on PORT:', PORT);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express API
module.exports = app;