'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, ShoppingCart, Users, Plus, Edit, Trash2 } from 'lucide-react';

import OrderEditModal from '@/components/OrderEditModal';

function AdminContent() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showOrderEditModal, setShowOrderEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    brand: '',
    unitSize: '',
    maspethPrice: '',
    maspethQuantity: '',
    jessupPrice: '',
    jessupQuantity: '',
    imageUrl: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `/api/admin/products?id=${editingProduct.id}` 
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      setMessage(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      setFormData({ name: '', description: '', price: '', stock: '', category: '', brand: '', imageUrl: '' });
      setEditingProduct(null);
      setShowProductForm(false);
      fetchData();
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      sku: product.sku || '',
      category: product.category,
      brand: product.brand || '',
      unitSize: product.unitSize || '',
      maspethPrice: product.maspethPrice?.toString() || product.price?.toString() || '',
      maspethQuantity: product.maspethQuantity?.toString() || product.stock?.toString() || '',
      jessupPrice: product.jessupPrice?.toString() || product.price?.toString() || '',
      jessupQuantity: product.jessupQuantity?.toString() || product.stock?.toString() || '',
      imageUrl: product.imageUrl || '',
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setMessage('Product deleted successfully!');
      fetchData();
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowOrderEditModal(true);
  };

  const handleSaveOrder = async (updatedOrder) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/orders?id=${updatedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: updatedOrder.items,
          shippingCharge: updatedOrder.shippingCharge,
          notes: updatedOrder.notes,
          total: updatedOrder.total,
        }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      setMessage('Order updated successfully!');
      setShowOrderEditModal(false);
      setEditingOrder(null);
      fetchData();
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      setMessage('Order status updated!');
      fetchData();
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Users className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Button onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setFormData({ 
                    name: '', 
                    description: '', 
                    sku: '', 
                    category: '', 
                    brand: '', 
                    unitSize: '',
                    maspethPrice: '', 
                    maspethQuantity: '', 
                    jessupPrice: '',
                    jessupQuantity: '',
                    imageUrl: '' 
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                {showProductForm && (
                  <form onSubmit={handleProductSubmit} className="mb-6 p-6 border border-border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    {/* Basic Information */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-sm text-foreground">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., RUMPUM Chicken Flavored Noodles 24 X 75g"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="sku">SKU *</Label>
                          <Input
                            id="sku"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="e.g., 10101101"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Noodles"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            placeholder="e.g., RUMPUM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="unitSize">Unit Size</Label>
                          <Input
                            id="unitSize"
                            value={formData.unitSize}
                            onChange={(e) => setFormData({ ...formData, unitSize: e.target.value })}
                            placeholder="e.g., 24 X 75g"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="imageUpload">Product Image</Label>
                          <div className="space-y-2">
                            <Input
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setFormData({ ...formData, imageUrl: reader.result });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="cursor-pointer"
                            />
                            {formData.imageUrl && (
                              <div className="mt-2">
                                <img 
                                  src={formData.imageUrl} 
                                  alt="Preview" 
                                  className="w-32 h-32 object-cover rounded-lg border border-border"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                >
                                  Remove Image
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Maspeth Warehouse */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-3 text-sm text-blue-900">Maspeth Warehouse (NY)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maspethPrice">Price *</Label>
                          <Input
                            id="maspethPrice"
                            type="number"
                            step="0.01"
                            value={formData.maspethPrice}
                            onChange={(e) => setFormData({ ...formData, maspethPrice: e.target.value })}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="maspethQuantity">Quantity *</Label>
                          <Input
                            id="maspethQuantity"
                            type="number"
                            value={formData.maspethQuantity}
                            onChange={(e) => setFormData({ ...formData, maspethQuantity: e.target.value })}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Jessup Warehouse */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-3 text-sm text-green-900">Jessup Warehouse (MD)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jessupPrice">Price *</Label>
                          <Input
                            id="jessupPrice"
                            type="number"
                            step="0.01"
                            value={formData.jessupPrice}
                            onChange={(e) => setFormData({ ...formData, jessupPrice: e.target.value })}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="jessupQuantity">Quantity *</Label>
                          <Input
                            id="jessupQuantity"
                            type="number"
                            value={formData.jessupQuantity}
                            onChange={(e) => setFormData({ ...formData, jessupQuantity: e.target.value })}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit">Save Product</Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.userEmail}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{order.items?.length || 0}</TableCell>
                          <TableCell className="font-semibold">
                            ${order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Approved">Approved</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Edit Modal */}
      <OrderEditModal
        open={showOrderEditModal}
        onClose={() => {
          setShowOrderEditModal(false);
          setEditingOrder(null);
        }}
        order={editingOrder}
        products={products}
        onSave={handleSaveOrder}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}