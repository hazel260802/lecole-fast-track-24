// routes/productRoutes.js
import express from "express";
import * as productController from "../controllers/product.js"; // Import product controller

const router = express.Router();


// /product/add-product => GET
router.get('/add-product', productController.getAddProduct);

// / => GET
router.get('/', productController.getProducts);

// /product/add-product => POST
router.post('/add-product', productController.postAddProduct);

router.get('/edit-product/:productId', productController.getEditProduct);

router.post('/edit-product', productController.postEditProduct);

router.post('/delete-product', productController.postDeleteProduct);

export default router;
