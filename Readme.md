# Shop & Package Delivery Management API

A RESTful API for managing shop information and package delivery settings. Built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Harshan_Backend
```

2. Install dependencies:
```bash
npm install express mongoose dotenv multer
```

3. Create required directories:
```bash
mkdir uploads
```

4. Create a `.env` file in project root:
```env
MONGODB_URI=mongodb://localhost:27017/shopdb
PORT=3000
```

5. Start MongoDB service:
```bash
# On Ubuntu/Debian
sudo service mongodb start

# On macOS with Homebrew
brew services start mongodb
```

6. Start the servers:
```bash
node Manage_Shops.js    # For shop management
node Package_Settings.js # For package delivery settings
```

The servers will start running at `http://localhost:3000`.

## 📚 API Documentation

### Shop Management API

#### Get All Shops
Retrieves a list of all shops with their names and FSSAI numbers.




```bash
GET /api/shops
```

##### Response
```json
[
  {
    "_id": "67a5017bf1d59fe33445fad7",
    "name": "Sample Shop",
    "fssaiNumber": "12345678901234"
  }
]
```


### Package Delivery API

#### Create Package Settings
Create new package delivery settings.

```bash
POST /api/package-settings
```

##### Request Body
```json
{
  "deliveryTime": 30,
  "deliveryRadius": 10,
  "freeDeliveryRadius": 5,
  "orderValueRanges": [
    {
      "minOrderValue": 0,
      "maxOrderValue": 500,
      "deliveryCharge": 50
    },
    {
      "minOrderValue": 501,
      "maxOrderValue": 1000,
      "deliveryCharge": 30
    },
    {
      "minOrderValue": 1001,
      "maxOrderValue": 999999,
      "deliveryCharge": 0
    }
  ]
}
```

##### Response
```json
{
  "success": true,
  "data": {
    "_id": "65c3d8f12a8f4b2b3c4d5e6f",
    "deliveryTime": 30,
    "deliveryRadius": 10,
    "freeDeliveryRadius": 5,
    "orderValueRanges": [
      {
        "minOrderValue": 0,
        "maxOrderValue": 500,
        "deliveryCharge": 50
      },
      {
        "minOrderValue": 501,
        "maxOrderValue": 1000,
        "deliveryCharge": 30
      },
      {
        "minOrderValue": 1001,
        "maxOrderValue": 999999,
        "deliveryCharge": 0
      }
    ],
    "createdAt": "2025-02-07T10:30:00.000Z",
    "updatedAt": "2025-02-07T10:30:00.000Z"
  }
}
```
#### Create Product
Create a new product with images and details.

 
```bash
POST /api/products
```

##### Request Body (form-data)
- `name` (Text): Product name
- `description` (Text): Product description
- `foodPreference` (Text): One of ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Contains Egg']
- `inStock` (Text): "true" or "false"
- `servingSize` (Text): e.g., "250g"
- `servingPerContainer` (Text): Number of servings
- `preparationTime` (Text): Time in minutes
- `notes` (Text): Additional notes
- `images` (File): Up to 5 image files

##### Example using Postman
1. Create a new POST request to `http://localhost:3000/api/products`
2. Set request type to "form-data"
3. Add the following key-value pairs:
```
name: "Chicken Biryani"
description: "Authentic Hyderabadi Biryani"
foodPreference: "Non-Vegetarian"
inStock: "true"
servingSize: "250g"
servingPerContainer: "2"
preparationTime: "30"
notes: "Spicy dish"
images: [Select files] (Type: File)
```

##### Response
```json
{
  "success": true,
  "data": {
    "_id": "65c3d8f12a8f4b2b3c4d5e6f",
    "name": "Chicken Biryani",
    "description": "Authentic Hyderabadi Biryani",
    "images": [
      "/uploads/1707492301234-image1.png"
    ],
    "inStock": true,
    "foodPreference": "Non-Vegetarian",
    "servingInformation": {
      "servingSize": "250g",
      "servingPerContainer": 2,
      "preparationTime": 30
    },
    "notes": "Spicy dish",
    "createdAt": "2025-02-07T10:30:00.000Z"
  }
}
```


## 🔧 Configuration

The API uses the following default configuration:
- Server Port: 3000
- MongoDB URL: mongodb://localhost:27017/shopdb
- Image Upload Directory: ./uploads/

## ⚠️ Error Handling

Both APIs return appropriate HTTP status codes:
- 200: Success
- 201: Created successfully
- 400: Bad request / Invalid input
- 404: Resource not found
- 500: Server error

Error responses include a message explaining the error:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 📁 Project Structure
```
Harshan_Backend/
├── Manage_Shops.js     # Shop management API
├── Package_Settings.js # Package delivery API
├── Product.js # Product delivery API
├── uploads/           # Directory for stored images
└── README.md        # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
