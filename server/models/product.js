// models/productModel.js
import { db } from "../../database/database.js"; // Import the database connection

// Constructor for Product model
export class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Method to save a new product or update an existing product
  save() {
    if (this.id) {
      // Update existing product
      return new Promise((resolve, reject) => {
        db.run(
          `UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?`,
          [this.title, this.description, this.price, this.imageUrl, this.id],
          function (err) {
            if (err) {
              reject(err);
            }
            resolve(this);
          }
        );
      });
    } else {
      // Insert a new product
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)`,
          [this.title, this.description, this.price, this.imageUrl],
          function (err) {
            if (err) {
              reject(err);
            }
            this.id = this.lastID; // Set the newly inserted ID
            resolve(this);
          }
        );
      });
    }
  }

  // Fetch all products from the database
  static fetchAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Find a product by its ID
  static findById(productId) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  // Delete a product by its ID
  static deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM products WHERE id = ?", [productId], function (err) {
        if (err) {
          reject(err);
        }
        resolve(this);
      });
    });
  }
}
