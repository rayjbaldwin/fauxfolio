// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
