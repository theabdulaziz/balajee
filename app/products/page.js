'use client';

import { useState, useEffect } from 'react';
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
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1717082778340-6bcc3a24f33d?w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen">
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
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                          {product.sku && (
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.brand && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            Brand: {product.brand}
                          </span>
                        )}
                        {product.unitSize && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {product.unitSize}
                          </span>
                        )}
                        {product.stock > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                            In Stock: {product.stock}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(product, 1)}
                          disabled={product.stock <= 0}
                          className="px-6"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}