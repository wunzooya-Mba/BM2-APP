const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// WORLDWIDE POSTS STORAGE
let posts = [
  {
    user: "Wunizooya Mba",
    zone: "tamale",
    text: "hello tamale! FBZone is live from ghana to the world",
    fire: 1,
    time: new Date().toLocaleString()
  }
];

// Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('FBZone worldwide API running 🌍');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'FBZone API working!', status: 'Worldwide 🌍' });
});

// ===== NEW PHASE 2 WORLDWIDE ENDPOINTS =====
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { user, zone, text } = req.body;
  const newPost = {
    user: user || "Anonymous",
    zone: zone || "global",
    text,
    fire: 0,
    time: new Date().toLocaleString()
  };
  posts.unshift(newPost);
  if(posts.length > 100) posts = posts.slice(0, 100);
  res.json({ success: true, posts });
});

app.post('/api/posts/:id/fire', (req, res) => {
  const id = parseInt(req.params.id);
  if(posts[id]!== undefined) {
    posts[id].fire = (posts[id].fire || 0) + 1;
    res.json({ success: true, fire: posts[id].fire });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FBZone API running on ${PORT}`);
});

module.exports = app;
