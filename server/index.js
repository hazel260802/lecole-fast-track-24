import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

// Tạo ứng dụng Express
const app = express();
const port = 3000;
let db;

// Database connection and setup
const connect = (callback) => {
  db = new sqlite3.Database("./database/products.db", (err) => {
    if (err) {
      console.error('Error opening database:', err);
      callback(err);
      return;
    }
    console.log('Connected to the SQLite database.');
    callback(null, db); // Pass the database object on successful connection
  });
};

const createTable = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
      )
    `);
  });
};

const seedData = (callback) => {
  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
      callback(err);
      return;
    }
    if (row?.count === 0) {
      const products = [
        { name: 'Product A', description: 'Description of Product A', price: 19.99, stock: 100 },
        { name: 'Product B', description: 'Description of Product B', price: 29.99, stock: 150 },
        { name: 'Product C', description: 'Description of Product C', price: 9.99, stock: 200 },
        { name: 'Product D', description: 'Description of Product D', price: 49.99, stock: 80 },
        { name: 'Product E', description: 'Description of Product E', price: 24.99, stock: 50 },
      ];

      const stmt = db.prepare('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)');
      for (const product of products) {
        stmt.run(product.name, product.description, product.price, product.stock);
      }
      stmt.finalize((err) => {
        if (err) {
          callback(err);
          return;
        }
        console.log('Database seeded with dummy data');
        callback(null);
      });
    } else {
      console.log('Database already seeded. Skipping seeding.');
      callback(null);
    }
  });
};

const getProducts = (callback) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, rows);
  });
};

// Model for Product
class Product {
  constructor(id, name, description, price, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }

  static async addProduct(product) {
    const sqlString = "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      db.run(sqlString, [product.name, product.description, product.price, product.stock], function (err) {
        if (err) {
          reject("Error inserting product: " + err);
        } else {
          resolve(this.lastID); // Return the ID of the inserted product
        }
      });
    });
  }

  static async deleteProduct(id) {
    const sqlString = "DELETE FROM products WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.run(sqlString, [id], function (err) {
        if (err) {
          reject("Error deleting product: " + err);
        } else {
          resolve(this.changes); // Return number of affected rows
        }
      });
    });
  }

  static async fetchAll() {
    const sqlString = "SELECT * FROM products";
    return new Promise((resolve, reject) => {
      db.all(sqlString, [], (err, rows) => {
        if (err) {
          reject("Error fetching products: " + err);
        } else {
          resolve(rows); // Return all rows
        }
      });
    });
  }

  static async findById(id) {
    const sqlString = "SELECT * FROM products WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.get(sqlString, [id], (err, row) => {
        if (err) {
          reject("Error fetching product by id: " + err);
        } else {
          resolve(row); // Return the found product row
        }
      });
    });
  }
  static async updateProduct(id, name, description, price, stock) {
    const sqlString = "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.run(sqlString, [name, description, price, stock, id], function (err) {
        if (err) {
          reject("Error updating product: " + err);
        } else if (this.changes === 0) {
          reject("No product found with the provided id.");
        } else {
          resolve(this.changes); 
        }
      });
    });
  }
}

// Express middleware setup
app.use(cors({  origin: ["http://localhost:5173", "http://172.17.0.2:5173"], }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes (you can define them directly here or separate if needed)

// Get all products
app.get('/admin/products', (req, res) => {
  Product.fetchAll()
    .then(rows => {
      res.json({ prods: rows });
    })
    .catch(err => console.log(err));
});

// Get add product page
app.get('/admin/add-product', (req, res) => {
  res.json({ pageTitle: 'Add Product', editing: false });
});

// Add new product
app.post('/admin/add-product', (req, res) => {
  const { name, description, price, stock } = req.body;
  const product = new Product(null, name, description, price, stock);
  Product.addProduct(product)
    .then(result => {
      console.log('Created Product:', result);
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
});

// Get product details page
app.get('/admin/edit-product/:productId', (req, res) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(product => {
      res.json({ pageTitle: 'Edit Product', editing: true, product });
    })
    .catch(err => console.log(err));
});

// Update product
app.put('/admin/edit-product/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;  // Get the updated product details from the body

  if (!id) {
    return res.status(400).json({ error: "Product ID is required for update" });
  }

  Product.updateProduct(id, name, description, price, stock)
    .then(() => {
      res.status(200).json({ message: 'Product updated successfully' });
    })
    .catch(err => {
      console.error('Error updating product:', err);
      res.status(500).json({ error: "Failed to update product" });
    });
});




// Delete product
app.post('/admin/delete-product', (req, res) => {
  const { productId } = req.body;
  Product.deleteProduct(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
});

// Error handling
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Connect to the database and initialize the app
const initializeApp = () => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }

  createTable();

  seedData((err) => {
    if (err) {
      console.error('Error seeding data:', err);
    }

    initializeApp();
  });
});
