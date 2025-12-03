'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <span className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}