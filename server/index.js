import express from "express";
import http from "http";
import cors from "cors"; // Import CORS middleware
import setupSocket from "./socket/socket.js"; // Import socket setup function
import { initDatabase, seedDatabase } from "../database/database.js"; // Import database functions
import authRoutes from "./routes/auth.js"; // Import auth routes
import productRoutes from "./routes/product.js"; // Import product routes
import errorController from "./controllers/error.js"; // Import error controller

const app = express();
const port = 3000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io with CORS and pass the server instance to it
setupSocket(server);

// Middleware for parsing JSON request bodies
app.use(express.json());

// Enable CORS for development purposes
app.use(
  cors({
    origin: ["http://localhost:5173", "http://172.17.0.2:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Use the imported routes
app.use("/api/auth", authRoutes); // All authentication-related routes will be under /api/auth
app.use("/api/product", productRoutes); // All product-related routes will be under /api/product

// Error handling middleware
app.use(errorController);

// Initialize the database and seed it with sample data
initDatabase();
seedDatabase();


// Start the server on the specified port
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
