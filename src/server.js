require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

// {
//   "dependencies": {
//     "bcrypt": "^6.0.0",
//     "cookie-parser": "^1.4.7",
//     "cors": "^2.8.5",
//     "dotenv": "^17.2.3",
//     "express": "^5.2.1",
//     "express-rate-limit": "^8.2.1",
//     "helmet": "^8.1.0",
//     "joi": "^18.0.2",
//     "jsonwebtoken": "^9.0.3",
//     "mongoose": "^9.0.2",
//     "nodemailer": "^7.0.11",
//     "swagger-jsdoc": "^6.2.8",
//     "swagger-ui-express": "^5.0.1",
//     "zod": "^4.2.1"
//   },
//   "devDependencies": {
//     "nodemon": "^3.1.11"
//   }
// }
