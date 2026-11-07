# Backend

A Node.js + Express backend API built for managing users, videos, subscriptions, comments, likes, tweets, playlists, and dashboard-related data with MongoDB via Mongoose.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary
- JWT, bcrypt, cookie-parser, cors
- Multer for file uploads

## Project Structure

```bash
.
├── src/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── public/
├── postman/
├── .gitignore
├── .postman/
├── index.js
├── package.json
├── test-db.js
└── README.md
```

## Features

- User management APIs
- Subscription APIs
- Video APIs
- Comment APIs
- Like APIs
- Tweet APIs
- Playlist APIs
- Dashboard APIs
- Health check endpoints
- Database connection with MongoDB
- Cloudinary integration for media handling

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB URI configured
- A `.env` file in the project root

## Environment Variables

Create a `.env` file with the following values:

```bash
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
```

You may also add other service credentials required by the project, such as Cloudinary and JWT secrets if used by your implementation.

## Installation

```bash
npm install
```

## Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Base URL

```bash
http://localhost:8000/api/v1
```

## Example Routes

```bash
/api/v1/users
/api/v1/subscriptions
/api/v1/videos
/api/v1/comments
/api/v1/likes
/api/v1/tweets
/api/v1/playlists
/api/v1/dashboards
/api/v1/healthchecks
```

## Notes

The app uses Express 5 and is structured around modular route and controller logic in the `src` directory. The main server entry point is `src/index.js`, while the application configuration lives in `src/app.js`.

## License

This project is licensed under ISC.
