// models/userModel.js
import { db } from "../../database/database.js"; // Import the database connection

// Function to insert a new user into the database
export const createUser = (username, roles, secret_phrase, callback) => {
  const sql = "INSERT INTO users (username, roles, secret_phrase) VALUES (?, ?, ?)";
  db.run(sql, [username, roles, secret_phrase], callback);
};

// Function to get a user by username
export const getUserByUsername = (username, callback) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], callback);
};

// Function to get user by their id from the database
export const getUserById = (userId, callback) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  
  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      return callback(err);
    }
    
    if (!row) {
      return callback(null, null); // No user found
    }

    return callback(null, row); // Return the user object
  });
};

// Function to update a user's secret phrase
export const updateUserSecretPhrase = (userId, newSecretPhrase, callback) => {
  if (typeof userId !== 'number') {
    return callback(new Error('Invalid user ID type'));
  }
  if (typeof newSecretPhrase !== 'string') {
    return callback(new Error('Invalid secret phrase type'));
  }

  const sql = "UPDATE users SET secret_phrase = ? WHERE id = ?";

  db.run(sql, [newSecretPhrase, userId], function(err) {
    if (err) {
      console.error('Error updating secret phrase:', err);
      return callback(err);
    }
    
    if (this.changes === 0) {
      return callback(new Error('No user found with the given ID'));
    }

    return callback(null, { message: 'Secret phrase updated successfully' });
  });
};

// Function to get all users based on the role
export const getAllUsers = (roles, username, callback) => {
  let sql;

  // SQL queries based on the role
  if (roles === "admin") {
    // Admin sees all user details
    sql = "SELECT * FROM users ORDER BY id DESC";
    db.all(sql, [], callback); // Admin does not need a user ID for filtering
  } else if (roles === "user") {
    // Authenticated users see their username, role, and secret_phrase only
    sql = "SELECT username, roles, secret_phrase FROM users WHERE username = ? ORDER BY id DESC";
    db.all(sql, [username], callback); // Use username for filtering to only show the user's own data
  } else if (roles === "non-authenticated") {
    // Non-authenticated users see only usernames and roles
    sql = "SELECT username, roles FROM users ORDER BY id DESC";
    db.all(sql, [], callback); // Non-authenticated users see all users' usernames and roles
  } else {
    // If the role is invalid, return an error
    callback(new Error("Invalid role"), null);
  }
};
