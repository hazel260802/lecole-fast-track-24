
import { z } from "zod";

// 1. Define the Product schema
export const productSchema = z.object({
  id: z.number().int().positive(), // id should be a positive integer
  name: z.string().min(1, "Product name is required"), // Name cannot be empty
  description: z.string().optional(), // Description is optional
  price: z.number().min(0, "Price cannot be negative"), // Price should be a positive number
  stock: z.number().int().min(0, "Stock cannot be negative"), // Stock should be a non-negative integer
});

export type Product = z.infer<typeof productSchema>;

// 2. Define ProductListRespond schema (API response for product list)
export const productListRespondSchema = z.object({
  prods: z.array(productSchema), // Array of products
  totalCount: z.number(), // Total number of products in the backend (for pagination)
  page: z.number(), // Current page number
  pageSize: z.number(), // Size of the page (items per page)
});

export type ProductListRespond = z.infer<typeof productListRespondSchema>;

// 3. Define Alert schema (for alerts)
export const alertSchema = z.object({
  message: z.string().min(1, "Alert message is required"),
  type: z.enum(["success", "error", "warning", "info"]), // Alert types (success, error, etc.)
  timeout: z.number().optional().default(5000), // Timeout for the alert (in milliseconds, default 5 seconds)
});

export type Alert = z.infer<typeof alertSchema>;

// 4. Define ProductEdit schema (for editing a product by ID)
export const productCreateSchema = z.object({
  name: z.string().min(1).optional(), // Name is optional for editing
  description: z.string().optional(), // Description is optional for editing
  price: z.number().min(0).optional(), // Price is optional for editing
  stock: z.number().int().min(0).optional(), // Stock is optional for editing
});

export type ProductCreate = z.infer<typeof productCreateSchema>;
export type EditingProduct = Omit<Product, 'id'>