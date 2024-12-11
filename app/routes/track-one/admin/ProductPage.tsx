import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/Form";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea"; // For description input
import { productCreateSchema } from "../../../lib/types"; // Import the correct schema for editing
import type { Product, EditingProduct } from "../../../lib/types";
import { createProduct, updateProduct } from "../../../lib/api"; // Import your API update function

export function ProductForm({ onSave, existingProduct }: Readonly<{ onSave: (data: any) => void, existingProduct?: Product }>) {
  const form = useForm({
    resolver: zodResolver(productCreateSchema), // Use the productCreateSchema for editing
    defaultValues: {
      name: existingProduct?.name ?? "",
      description: existingProduct?.description ?? "",
      price: existingProduct?.price ?? 0,
      stock: existingProduct?.stock ?? 0,
    },
  });

  const onSubmit = async (data: EditingProduct) => {
    try {
      let savedProduct;
      if (existingProduct) {
        // Update existing product with the correct id
        savedProduct = await updateProduct({id: existingProduct.id, ...data}); 
      } else {
        // Create a new product without id
        console.log("Creating new product");
        savedProduct = await createProduct(data);
      }
      console.log(savedProduct);
      // Call onSave after successful save, passing relevant data
      onSave(savedProduct); 
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product price"
                  min={0}
                  type="number" // Ensures input is numeric
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Stock Field */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product stock"
                  min={0}
                  type="number" // Ensures input is numeric
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <FormItem>
          <FormControl>
            <Button type="submit">{existingProduct ? 'Update Product' : 'Create Product'}</Button>
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );
}
