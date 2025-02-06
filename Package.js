require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schema
const packageSchema = new mongoose.Schema({
  deliveryTime: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryRadius: {
    type: Number,
    required: true,
    min: 0
  },
  freeDeliveryRadius: {
    type: Number,
    required: true,
    min: 0
  },
  orderValueRanges: [{
    minOrderValue: {
      type: Number,
      required: true,
      min: 0
    },
    maxOrderValue: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true
});

// Create MongoDB model
const Package = mongoose.model('Package', packageSchema);

// POST endpoint to create package delivery settings
app.post('/api/package-settings', async (req, res) => {
  try {
    const {
      deliveryTime,
      deliveryRadius,
      freeDeliveryRadius,
      orderValueRanges
    } = req.body;

    // Validate input
    if (!deliveryTime || !deliveryRadius || !freeDeliveryRadius || !orderValueRanges) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate order value ranges
    for (let range of orderValueRanges) {
      if (range.minOrderValue >= range.maxOrderValue) {
        return res.status(400).json({
          success: false,
          message: 'Maximum order value must be greater than minimum order value'
        });
      }
    }

    // Create new package settings
    const packageSettings = new Package({
      deliveryTime,
      deliveryRadius,
      freeDeliveryRadius,
      orderValueRanges
    });

    // Save to database
    await packageSettings.save();

    res.status(201).json({
      success: true,
      data: packageSettings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET endpoint to retrieve all package settings
app.get('/api/package-settings', async (req, res) => {
  try {
    const settings = await Package.find();
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET endpoint to retrieve specific package settings by ID
app.get('/api/package-settings/:id', async (req, res) => {
  try {
    const settings = await Package.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT endpoint to update package settings
app.put('/api/package-settings/:id', async (req, res) => {
  try {
    const settings = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE endpoint to remove package settings
app.delete('/api/package-settings/:id', async (req, res) => {
  try {
    const settings = await Package.findByIdAndDelete(req.params.id);
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Settings deleted successfully'
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