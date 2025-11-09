const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const campaignRoutes = require('./routes/campaigns');
const errorHandler = require('./utils/errorHandler');

dotenv.config();

// Initialise database pool and expose for warm-up errors
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/campaigns', campaignRoutes);

app.use('*', (_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
