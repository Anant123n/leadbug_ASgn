require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./DbConfig/db');

const onboardingRoutes = require('./routes/onboarding');
const templateRoutes = require('./routes/templates');
const sequenceRoutes = require('./routes/sequences');
const contactRoutes = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/sequences', sequenceRoutes);
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Leadbug WhatsApp CRM API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Leadbug API server running on http://localhost:${PORT}`);
});
