import { type Product, type ProductCreate, type ProductListRespond } from './types'

const API_URL =  'http://localhost:3000/admin'

export async function fetchProducts({page=1,limit=6}:{page?:number,limit?:number}): Promise<ProductListRespond> {
  const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function createProduct(product: ProductCreate): Promise<Product> {
  const res = await fetch(`${API_URL}/add-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(product: Product): Promise<Product> {
  if (!product.id) {
    throw new Error('Product ID is required');
  }

  try {
    const res = await fetch(`${API_URL}/edit-product/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to update product');
    }

    return res.json();
  } catch (err) {
    console.error('Error updating product:', err);
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}



// Updated deleteProduct function for frontend
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/delete-product`, {
    method: 'POST', // Use POST to match backend
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId: id }), // Send the productId in the request body
  });

  if (!res.ok) throw new Error('Failed to delete product');
}
