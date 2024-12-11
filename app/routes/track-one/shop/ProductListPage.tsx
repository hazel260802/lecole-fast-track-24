import React, { useState, useEffect, useCallback } from "react";
import type { Product } from "../../../lib/types"; // Import the Product type for type safety
import ProductCard from "../../../components/ui/ProductCard"; // Import the ProductCard component for rendering individual products
import { fetchProducts, deleteProduct } from "../../../lib/api"; // Import API functions for fetching and deleting products
import { ProductForm } from "../admin/ProductPage"; // Import the CreateProductForm to use for adding/editing products

interface ProductListProps {}

export const ProductList: React.FC<ProductListProps> = () => {
  // State to hold the list of products, loading state, and error message
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); // Initially, loading is true until data is fetched
  const [error, setError] = useState<string | null>(null); // Error state to display if there are issues fetching data

  // State to manage whether the form is visible and the product being edited (if any)
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Function to fetch products from API
  const loadProducts = useCallback(async () => {
    setLoading(true); // Set loading to true when we start fetching
    setError(null); // Clear any previous errors
    try {
      const productList = await fetchProducts({ page: 1, limit: 6 }); // Fetch products from API with pagination
      
      // Check if the response data is valid and an array
      if (productList?.prods && Array.isArray(productList.prods)) {
        setProducts(productList.prods); // Set the products state with the fetched data
      } else {
        setError("Invalid data format received from API"); // Handle unexpected data format
      }
    } catch (err) {
      setError("Failed to fetch products"); // Handle API errors
    } finally {
      setLoading(false); // Set loading to false once the fetching is complete
    }
  }, []);

  // Function to handle product deletion
  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id); // Call the deleteProduct API to delete the product
      // Update the products state by filtering out the deleted product
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id)); 
    } catch (err) {
      setError("Failed to delete product"); // Handle errors during deletion
    }
  };

  // Function to handle opening the edit form for a product
  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Set the product to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  // Function to handle opening the form to add a new product
  const handleAdd = () => {
    setEditingProduct(undefined); // No product to edit
    setIsFormVisible(true); // Show the form for adding a new product
  };

  // Close the form when finished editing or adding a product
  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  // Function to handle saving a product (either new or edited)
  const handleSave = () => {
    loadProducts();
    handleCloseForm();
  };

  useEffect(() => {
    loadProducts(); 
  }, [loadProducts]); 

  // Function to render content based on loading, error, or product data
  const renderContent = () => {
    if (loading) return <div>Loading...</div>; // Show loading message while fetching
    if (error) return <div>{error}</div>; // Show error message if there was an issue
    if (products.length === 0) return <div>No products available</div>; // Show message if no products are available

    // Render the products as ProductCard components
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id} // Unique key for each product
              product={product} // Pass product data to the ProductCard component
              onEdit={() => handleEdit(product)} // Pass the edit handler to open the edit form
              onDelete={() => handleDelete(product.id)} // Pass the delete handler for deleting a product
            />
          ))}
        </div>
        {/* Add a button to add a new product */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleAdd} 
            className="w-48 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add New Product
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {isFormVisible ? (
        <ProductForm 
          onSave={handleSave} 
          existingProduct={editingProduct} 
        />
      ) : (
        renderContent()
      )}
    </div>
  ); // Render the content based on the current state, or show the form if needed
};
