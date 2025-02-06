const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shopdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const Shop = mongoose.model('Shop', {
  name: String,
  fssaiNumber: String,
  imageUrl: String
});

// GET route to retrieve shop data
app.get('/api/shops', async (req, res) => {
  try {
    const shops = await Shop.find({}, 'name fssaiNumber');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update shop with image
app.post('/api/shops/:id', upload.single('image'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    
    shop.imageUrl = `/uploads/${req.file.filename}`;
    await shop.save();
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/uploads', express.static('uploads'));
app.listen(3000, () => console.log('Server running on port 3000'));