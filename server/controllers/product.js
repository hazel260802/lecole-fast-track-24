// controllers/productController.js
import { Product } from "../models/product.js"; // Import the Product model

// GET: /product/add-product
export const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

// POST: /product/add-product
export const postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  // Create a new Product instance
  const product = new Product(null, title, imageUrl, description, price);
  
  // Save the product to the database
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

// GET: /product/edit-product/:productId
export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  
  // Find the product by ID
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

// POST: /product/edit-product
export const postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;

  // Create a new Product instance with updated details
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  
  // Save the updated product
  updatedProduct.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

// GET: /product/products
export const getProducts = (req, res, next) => {
  // Fetch all products from the database
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

// POST: /product/delete-product
export const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  // Delete the product by ID
  Product.deleteProduct(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
