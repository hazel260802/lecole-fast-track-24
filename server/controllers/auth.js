import * as userModel from "../models/auth.js"; // Import user model
import { generateToken } from "../utils/token.js"; // Import the token generation function

// Function to register a new user
export const registerUser = (req, res) => {
  const { username, roles, secret_phrase } = req.body;

  // Validate input
  if (!username || !roles || !secret_phrase) {
    return res.status(400).json({ error: "Username, roles, and secret phrase are required" });
  }

  // Insert user into the database
  userModel.createUser(username, roles, secret_phrase, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ message: "User created successfully" });
  });
};

// Function to login a user
export const loginUser = (req, res) => {
  const { username, secret_phrase } = req.body;

  // Validate input
  if (!username || !secret_phrase) {
    return res.status(400).json({ success: false, message: "Username and secret phrase are required" });
  }

  userModel.getUserByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!user || user.secret_phrase !== secret_phrase) {
      return res.status(401).json({ success: false, message: "Invalid username or secret phrase" });
    }

    // Generate token with user details
    const token = generateToken({ username: user.username, roles: user.roles });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      roles: user.roles, // Include the role in the response
    });
  });
};

// Function to log out a user
export const logoutUser = (req, res) => {
  try {
    // Check if the user is already logged in or not
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(400).json({
      success: false,
      message: "User is not logged in",
      });
    }

    // Clear the authorization header or any session/cookie token logic
    req.headers['authorization'] = null;

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


// Function to update the user's secret phrase (only by admin or the user themselves)
export const updateSecretPhrase = (req, res) => {
  const { secret_phrase: newSecretPhrase  } = req.body;  // Get newSecretPhrase from the request body
  const { username, roles } = req.user;  // Extract username and roles from the token

  // Check if username is provided (this should always be available if the user is authenticated)
  if (!username) {
    return res.status(400).json({ error: 'Username missing in request' });
  }

  // Ensure that newSecretPhrase is provided in the request body
  if (!newSecretPhrase) {
    return res.status(400).json({ error: 'Missing required parameter: newSecretPhrase' });
  }

  // Fetch the user from the database using the username
  userModel.getUserByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error while fetching user' });
    }

    if (!user) {
      return res.status(404).json({ error: `User not found: ${username}` });
    }

    // Check if the user is an admin or the user themselves
    if (roles !== 'admin' && user.username !== username) {
      return res.status(403).json({ error: 'Access denied' });
    }
    console.log(user.id, newSecretPhrase);
    // Call the model function to update the secret phrase
    userModel.updateUserSecretPhrase(user.id, newSecretPhrase, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update secret phrase' });
      }
      return res.status(200).json({ message: 'Secret phrase updated successfully' });
    });
  });
};

// Function to get all users based on the role
export const getAllUsers = (req, res) => {
  const { roles, username } = req.user || {}; // Extract user roles and username from req.user

  if (!roles) {
    return res.status(403).json({ error: "Access denied" });
  }

  // Query the model based on the role
  userModel.getAllUsers(roles, username, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    let filteredUsers = [];

    if (roles === "admin") {
      // Admin sees all user details
      filteredUsers = users;
    } else if (roles === "user") {
      // Authenticated users see only their username, role, and secret_phrase
      filteredUsers = users.filter(user => user.username === username).map(user => {
        return {
          username: user.username,
          roles: user.roles,
          secret_phrase: user.secret_phrase,
        };
      });
    } else if (roles === "non-authenticated") {
      // Non-authenticated users see only usernames and roles
      filteredUsers = users.map(user => {
        return {
          username: user.username,
          roles: user.roles,
        };
      });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json({ users: filteredUsers });
  });
};
