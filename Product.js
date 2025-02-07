require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize express app
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer Configuration for Image Upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// MongoDB Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required']
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  foodPreference: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Contains Egg'],
    required: [true, 'Food preference is required']
  },
  servingInformation: {
    servingSize: {
      type: String,
      required: [true, 'Serving size is required']
    },
    servingPerContainer: {
      type: Number,
      required: [true, 'Servings per container is required']
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required']
    }
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create MongoDB model
const Product = mongoose.model('Product', productSchema);

// POST endpoint to create a new product
app.post('/api/products', upload.array('images', 5), async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.description || !req.body.foodPreference) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Process uploaded images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    // Create image URLs array
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Parse serving information
    const servingInformation = {
      servingSize: req.body.servingSize,
      servingPerContainer: parseInt(req.body.servingPerContainer),
      preparationTime: parseInt(req.body.preparationTime)
    };

    // Create new product
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      images: imageUrls,
      inStock: req.body.inStock === 'true',
      foodPreference: req.body.foodPreference,
      servingInformation: servingInformation,
      notes: req.body.notes || ''
    });

    // Save to database
    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    // Delete uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET endpoint to retrieve all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));