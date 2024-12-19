import jwt from "jsonwebtoken"; // Import the jsonwebtoken package

// Use environment variable for the secret key with a fallback
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key"; 

/**
 * Function to generate a JWT token.
 * @param {Object} user - The user object containing user details.
 * @param {string} user.username - The username of the user.
 * @param {string} user.roles - The roles assigned to the user.
 * @returns {string} - A signed JWT token.
 */
export const generateToken = (user) => {
  if (!user || !user.username || !user.roles) {
    throw new Error("User object is missing required fields");
  }

  const payload = {
    username: user.username,
    roles: user.roles,
  };

  // Generate and return the token
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token valid for 1 hour
};

/**
 * Function to verify a JWT token.
 * @param {string} token - The JWT token to verify.
 * @param {Function} callback - A callback function to handle verification result.
 * Callback signature: (error: Error | null, decoded: Object | null) => void
 */
export const verifyToken = (token, callback) => {
  if (!token) {
    callback(new Error("Token is required"), null); // Handle missing token
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      callback(err, null); // Pass error if the token is invalid or expired
    } else {
      callback(null, decoded); // Pass the decoded token data if valid
    }
  });
};
