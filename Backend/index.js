const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require("./Routes/User.route")
const openTdbRoutes = require("./Routes/openTDB.route")
const testRoutes = require("./Routes/Test.route")
const resultRoutes = require("./Routes/result.route")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opentdb', openTdbRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Port and server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));