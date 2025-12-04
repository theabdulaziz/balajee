'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Grid3x3, List } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [quantities, setQuantities] = useState({}); // Track quantities for all products

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, category, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    // Silent update - no popup
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Our Products</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by product name, SKU, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid3x3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          {/* Products Display */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const quantity = quantities[product.id] || 1;
                  const setQuantity = (val) => setQuantities({ ...quantities, [product.id]: val });
                  
                  return (
                    <div key={product.id} className="bg-card border border-border rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1717082778340-6bcc3a24f33d?w=300&h=300&fit=crop'}
                        alt={product.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1717082778340-6bcc3a24f33d?w=300&h=300&fit=crop'; }}
                      />
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-grow pr-2">
                            <h3 className="text-lg font-semibold text-foreground truncate">{product.name}</h3>
                            {product.sku && (
                              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                            )}
                          </div>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium whitespace-nowrap">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.brand && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                              {product.brand}
                            </span>
                          )}
                          {product.unitSize && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                              {product.unitSize}
                            </span>
                          )}
                          {product.stock > 0 ? (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                              Stock: {product.stock}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xl font-bold text-primary whitespace-nowrap">
                          ${product.price?.toFixed(2) || '0.00'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm"
                            min="1"
                          />
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                          >
                            +
                          </button>
                        </div>
                        <Button
                          onClick={() => {
                            handleAddToCart(product, quantity);
                            setQuantity(1);
                          }}
                          disabled={product.stock <= 0}
                          className="px-4 py-2 whitespace-nowrap"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-muted-foreground">No products found matching your criteria</p>
              <Button 
                onClick={() => { setSearchQuery(''); setCategory('all'); }}
                className="mt-4"
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
    </div>
  );
}