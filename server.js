const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('FBZone worldwide API running 🚀');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'FBZone API working!', status: 'worldwide 🌍' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
});