'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, Math.min(value, product.stock));
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    // Reset to 1 after adding
    setQuantity(1);
  };

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
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <span className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
        
        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Qty:</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 h-8 text-center border-0 focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add {quantity} to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}