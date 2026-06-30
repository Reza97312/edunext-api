# EduNext API - Enterprise Backend & Microservices

![Node.js](https://img.shields.io/badge/Node.js-20-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.2-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

The core backend infrastructure powering the EduNext Learning Management System. Built with Node.js, Express, and MongoDB, this RESTful API is fully containerized using Docker and designed for high availability, robust security, and seamless multimedia handling.

**Live API Documentation:** [Interactive Swagger UI](https://edunext-api-docker.onrender.com/api-docs)

## Architecture & Core Features

- Advanced Authentication Flow: Implements secure JWT-based authentication with short-lived Access Tokens and long-lived Refresh Tokens. Features silent token rotation on the client-side for an uninterrupted user experience.
- Enterprise-Grade Security: Hardened Express app using Helmet for secure HTTP headers, express-rate-limit to prevent brute-force/DDoS attacks, and strictly configured CORS policies.
- Cloud Media Management: Seamless integration with Cloudinary via multer-storage-cloudinary. Automatically categorizes and optimizes user avatars, course thumbnails, and heavy video content.
- Dockerized Infrastructure: Fully containerized environment with multi-container orchestration (docker-compose) linking the Node.js API with a persistent MongoDB instance.
- Role-Based Access Control (RBAC): Custom middleware to handle complex permission layers across Admin, Teacher, and Student routes.

## Technical Stack

- Runtime & Framework: Node.js (v20), Express.js (v5)
- Database & ORM: MongoDB, Mongoose
- Authentication & Security: JSON Web Tokens (JWT), bcrypt, Helmet, Express Rate Limit
- Validation: Joi
- File Uploads: Multer, Cloudinary API
- Deployment & DevOps: Docker, Docker Compose, Render

## Modular Domain Structure

The application follows a clean, modular architecture separating concerns into distinct domains:

- Auth
- Users
- Courses
- Categories
- Exams & Questions
- Certificates
- Payments
- Comments & Replies
- Admin & User Panels

## Getting Started (Docker Ready)

The recommended way to run this project locally is with Docker. This setup automatically provisions both the API server and the MongoDB database.

1. Clone the repository:

```bash   
git clone https://github.com/Reza97312/edunext-api.git
cd edunext-api
```

2. Create a `.env` file in the project root using the following template:

```env   
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URI=mongodb://admin:edunext_secret@mongo:27017/edunext?authSource=admin

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
3. Build and start the containers:
   
 ```bash
docker compose up --build
```

> If you're using an older version of Docker Compose, replace docker compose with docker-compose.

4. Once the containers are running, the services will be available at:

```text
API:      http://localhost:5050
Swagger:  http://localhost:5050/api-docs
MongoDB:  localhost:27017
```
