'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';

export default function AdminProductsList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState('maspeth');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, field, newValue) => {
    if (newValue < 0) return;

    try {
      const token = localStorage.getItem('token');
      const product = products.find(p => p.id === productId);
      
      const updateData = {
        ...product,
        [field]: parseInt(newValue)
      };

      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, [field]: parseInt(newValue) } : p
        ));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Product Inventory Management</h1>

        {/* Search and Warehouse Selector */}
        <div className="bg-card border border-border rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-foreground mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Warehouse View</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="maspeth">Maspeth, NY</option>
                <option value="jessup">Jessup, PA</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Product Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-foreground uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredProducts.map((product) => {
                    const quantityField = selectedWarehouse === 'maspeth' ? 'maspethQuantity' : 'jessupQuantity';
                    const currentQuantity = product[quantityField] || product.stock || 0;
                    
                    return (
                      <tr key={product.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">{product.sku}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{product.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{product.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(product.id, quantityField, currentQuantity - 1)}
                              className="p-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              value={currentQuantity}
                              onChange={(e) => updateQuantity(product.id, quantityField, e.target.value)}
                              className="w-20 px-2 py-1 text-center bg-input border border-border text-foreground rounded focus:ring-2 focus:ring-primary"
                              min="0"
                            />
                            <button
                              onClick={() => updateQuantity(product.id, quantityField, currentQuantity + 1)}
                              className="p-1 bg-primary/20 text-primary rounded hover:bg-primary/30"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
