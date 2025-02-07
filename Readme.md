# Shop Management API

A RESTful API for managing shop information including FSSAI numbers and shop images. Built with Node.js, Express, and MongoDB.

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

3. Create an uploads directory in the project root:
```bash
mkdir uploads
```

4. Start MongoDB service:
```bash
# On Ubuntu/Debian
sudo service mongodb start

# On macOS with Homebrew
brew services start mongodb
```

5. Start the server:
```bash
node Manage_Shops.js
```

The server will start running at `http://localhost:3000`.

## 📚 API Documentation

### Get All Shops
Retrieves a list of all shops with their names and FSSAI numbers.

```bash
GET /api/shops
```

#### Response
```json
[
  {
    "_id": "67a5017bf1d59fe33445fad7",
    "name": "Sample Shop",
    "fssaiNumber": "12345678901234"
  }
]
```

### Update Shop Image
Upload or update a shop's image by its ID.

```bash
POST /api/shops/:id
```

#### Parameters
- `id`: Shop ID (in URL)
- `image`: Image file (form-data)

#### Example using cURL
```bash
curl -X POST \
  -F "image=@path/to/your/image.png" \
  http://localhost:3000/api/shops/67a5017bf1d59fe33445fad7
```

#### Example using Postman
1. Create a new POST request
2. Enter URL: `http://localhost:3000/api/shops/67a5017bf1d59fe33445fad7`
3. Go to "Body" tab
4. Select "form-data"
5. Add key "image" (Type: File)
6. Select your image file
7. Send request

#### Response
```json
{
  "_id": "67a5017bf1d59fe33445fad7",
  "name": "Sample Shop",
  "fssaiNumber": "12345678901234",
  "imageUrl": "/uploads/1707492301234.png"
}
```




## 🔧 Configuration

The API uses the following default configuration:
- Server Port: 3000
- MongoDB URL: mongodb://localhost:27017/shopdb
- Image Upload Directory: ./uploads/

