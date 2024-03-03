// Load ENV variables from .env file first
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// Require packages
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");

// Import database connection
const connectDB = require("./config/db");

// Define variable
const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV;
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Connect to database
connectDB();

// Initialize express
const app = express();

// Swagger setup
const swaggerSetup = require("./config/swagger");
swaggerSetup(app);

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies
app.use(mongoSanitize()); // To prevent NoSQL injections
app.use(helmet()); // Sets various HTTP headers for security
app.use(xss()); // To prevent XSS attacks
app.use(limiter); // Apply rate limiting
app.use(hpp()); // To protect against HTTP Parameter Pollution attacks
app.use(cors()); // Enable CORS

// Routes
app.use('/api/massages', require("./routes/massageRouter"));
app.use('/api/auth', require("./routes/authRouter"));
app.use('/api/reservations', require("./routes/reservationRouter"));
app.use('/api/users', require("./routes/userRouter"));

// Start listening
const server = app.listen(PORT, () => {
    console.log(`Server running in ${MODE} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    console.error(err.stack); // Log the full error stack for debugging
    // Close server & exit process
    server.close(() => process.exit(1));
});
