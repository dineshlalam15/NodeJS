 # User Authentication and Management System

## Overview

This repository contains the code for a user authentication and management system built with Node.js, Express, and MongoDB. The system includes user registration, login, logout, password management, and profile updates. Cloudinary is used for storing user avatars and cover images, and JWT (JSON Web Tokens) are used for authentication.

## File Structure

1. **controllers/user.controller.js**: Contains all the logic for user operations like registration, login, logout, refreshing tokens, changing password, fetching current user details, and updating user details.

2. **models/user.model.js**: Defines the User schema and includes methods for password hashing, password verification, and token generation.

3. **routers/user.router.js**: Defines the API routes for user-related operations.

4. **middlewares/multer.middleware.js**: Configures multer for handling file uploads.

5. **middlewares/auth.middleware.js**: Contains middleware for verifying JWT tokens.

6. **utils/cloudinary.js**: Handles the uploading of files to Cloudinary.

7. **utils/asyncHandler.js**: Utility function for handling asynchronous operations and errors.

8. **utils/APIError.js**: Custom error class for handling API errors.

9. **utils/APIResponse.js**: Custom response class for sending API responses.

## API Endpoints

### User Registration

**Endpoint**: `/register`  
**Method**: `POST`  
**Description**: Registers a new user. Requires avatar upload.

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "userName": "johndoe",
  "password": "password123"
}
```

**Request Files**:
- `avatar`: User's avatar image (required)
- `coverImage`: User's cover image (optional)

**Response**:
```json
{
  "status": 201,
  "message": "User Registered Successfully",
  "data": {
    "userName": "johndoe",
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "avatar": "avatar_url",
    "coverImage": "cover_image_url"
  }
}
```

### User Login

**Endpoint**: `/login`  
**Method**: `POST`  
**Description**: Logs in a user and sets refresh and access tokens as cookies.

**Request Body**:
```json
{
  "userName": "johndoe",
  "password": "password123"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "userName": "johndoe",
      "fullName": "John Doe",
      "email": "johndoe@example.com"
    },
    "refreshToken": "refresh_token",
    "accessToken": "access_token"
  }
}
```

### User Logout

**Endpoint**: `/logout`  
**Method**: `POST`  
**Description**: Logs out a user by clearing the refresh and access tokens.

**Response**:
```json
{
  "status": 200,
  "message": "User logged out"
}
```

### Refresh Access Token

**Endpoint**: `/refresh-token`  
**Method**: `POST`  
**Description**: Refreshes the access token using the refresh token.

**Request Body**:
```json
{
  "refreshToken": "existing_refresh_token"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### Change Password

**Endpoint**: `/change-password`  
**Method**: `PATCH`  
**Description**: Changes the user's password.

**Request Body**:
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Password is changed"
}
```

### Get Current User

**Endpoint**: `/`  
**Method**: `GET`  
**Description**: Fetches the current logged-in user's details.

**Response**:
```json
{
  "status": 200,
  "message": "User details fetched successfully",
  "data": {
    "userName": "johndoe",
    "fullName": "John Doe",
    "email": "johndoe@example.com"
  }
}
```

### Update User Details

**Endpoint**: `/update-user`  
**Method**: `PATCH`  
**Description**: Updates the user's details and/or avatar and cover image.

**Request Body**:
```json
{
  "userName": "newusername",
  "fullName": "New Full Name",
  "email": "newemail@example.com"
}
```

**Request Files**:
- `avatar`: New avatar image (optional)
- `coverImage`: New cover image (optional)

**Response**:
```json
{
  "status": 200,
  "message": "User details updated successfully",
  "data": {
    "userName": "newusername",
    "fullName": "New Full Name",
    "email": "newemail@example.com",
    "avatar": "new_avatar_url",
    "coverImage": "new_cover_image_url"
  }
}
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repository-url
    ```

2. Install dependencies:
    ```bash
    cd your-repository
    npm install
    ```

3. Set up environment variables in a `.env` file:
    ```
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_EXPIRY=7d
    ```

4. Start the server:
    ```bash
    npm start
    ```

## Message
Feel free to raise issues in the code so that it would improve the readability to others. 

## Thank You

---