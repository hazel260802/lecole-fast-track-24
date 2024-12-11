import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import type { Product } from "~/lib/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <Card className="w-full sm:w-96 bg-white shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-base">Detailed description and additional product information can go here.</p>
      </CardContent>

      <CardFooter>
        <Button onClick={() => onEdit(product)} variant="outline" size="sm" className="mr-2">
          Edit Product
        </Button>
        <Button
          onClick={() => onDelete(product.id)} 
          variant="destructive" 
          size="sm"
        >
          Delete Product
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
