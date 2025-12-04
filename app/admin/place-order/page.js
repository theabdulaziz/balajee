'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPlaceOrder() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

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

    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handlePlaceOrder = async () => {
    if (!selectedCustomer) {
      setMessage({ type: 'error', text: 'Please select a customer' });
      return;
    }
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: selectedCustomer,
          items: cart.map(item => ({
            productId: item.id,
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Order placed successfully!' });
        setCart([]);
        setSelectedCustomer('');
        setTimeout(() => router.push('/admin'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to place order' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error placing order' });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Place Order for Customer</h1>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Select Products</h2>
                
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku} | ${product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-sm mb-2">Cart Items ({cart.length})</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                        <div className="flex-grow pr-2">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !selectedCustomer || cart.length === 0}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
