# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

### Register
```http
POST /auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

Response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "USER"
}
```

### Login
```http
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  }
}
```

## Products

### Get All Products
```http
GET /products
```

Query parameters:
- `name`: Tìm theo tên (optional)
- `categoryId`: Lọc theo danh mục (optional)
- `minPrice`: Giá tối thiểu (optional)
- `maxPrice`: Giá tối đa (optional)
- `inStock`: Còn hàng hay không (optional)
- `tags`: Mảng các tags (optional)

Response:
```json
[
  {
    "id": "product_id",
    "name": "Product Name",
    "slug": "product-name",
    "description": "Product Description",
    "originalPrice": 1000000,
    "importPrice": 800000,
    "importSource": "Source",
    "quantity": 10,
    "tags": ["tag1", "tag2"],
    "gameCode": "GAME123",
    "analyticsCode": "ANALYTICS123",
    "categoryId": "category_id",
    "createdAt": "2024-03-19T10:00:00Z",
    "updatedAt": "2024-03-19T10:00:00Z"
  }
]
```

### Get Product by ID
```http
GET /products/:id
```

Response:
```json
{
  "id": "product_id",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Product Description",
  "originalPrice": 1000000,
  "importPrice": 800000,
  "importSource": "Source",
  "quantity": 10,
  "tags": ["tag1", "tag2"],
  "gameCode": "GAME123",
  "analyticsCode": "ANALYTICS123",
  "categoryId": "category_id",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

### Create Product
```http
POST /products
```

Request body:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "originalPrice": 1000000,
  "importPrice": 800000,
  "importSource": "Source",
  "quantity": 10,
  "tags": ["tag1", "tag2"],
  "gameCode": "GAME123",
  "analyticsCode": "ANALYTICS123",
  "categoryId": "category_id"
}
```

Response:
```json
{
  "id": "product_id",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Product Description",
  "originalPrice": 1000000,
  "importPrice": 800000,
  "importSource": "Source",
  "quantity": 10,
  "tags": ["tag1", "tag2"],
  "gameCode": "GAME123",
  "analyticsCode": "ANALYTICS123",
  "categoryId": "category_id",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

### Update Product
```http
PUT /products/:id
```

Request body:
```json
{
  "name": "Updated Product Name",
  "description": "Updated Description",
  "originalPrice": 1200000,
  "importPrice": 900000,
  "importSource": "New Source",
  "quantity": 15,
  "tags": ["newtag1", "newtag2"],
  "gameCode": "NEWGAME123",
  "analyticsCode": "NEWANALYTICS123",
  "categoryId": "new_category_id"
}
```

Response:
```json
{
  "id": "product_id",
  "name": "Updated Product Name",
  "slug": "updated-product-name",
  "description": "Updated Description",
  "originalPrice": 1200000,
  "importPrice": 900000,
  "importSource": "New Source",
  "quantity": 15,
  "tags": ["newtag1", "newtag2"],
  "gameCode": "NEWGAME123",
  "analyticsCode": "NEWANALYTICS123",
  "categoryId": "new_category_id",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

### Delete Product
```http
DELETE /products/:id
```

Response:
```json
{
  "id": "product_id",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Product Description",
  "originalPrice": 1000000,
  "importPrice": 800000,
  "importSource": "Source",
  "quantity": 10,
  "tags": ["tag1", "tag2"],
  "gameCode": "GAME123",
  "analyticsCode": "ANALYTICS123",
  "categoryId": "category_id",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

## Headers

### Authentication
Để gọi các API được bảo vệ, thêm header:
```
Authorization: Bearer <jwt_token>
```

### Content Type
```
Content-Type: application/json
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
``` 