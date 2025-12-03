'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Trash2, PackagePlus } from 'lucide-react';

export default function OrderEditModal({ open, onClose, order, products, onSave }) {
  const [editedOrder, setEditedOrder] = useState(null);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [notes, setNotes] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    if (order) {
      setEditedOrder({
        ...order,
        items: [...order.items],
      });
      setShippingCharge(order.shippingCharge || 0);
      setNotes(order.notes || '');
    }
  }, [order]);

  useEffect(() => {
    if (products) {
      setAvailableProducts(products);
    }
  }, [products]);

  if (!editedOrder) return null;

  const updateItemQuantity = (itemId, change) => {
    setEditedOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      ),
    }));
  };

  const updateItemPrice = (itemId, newPrice) => {
    setEditedOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, price: parseFloat(newPrice) || 0 }
          : item
      ),
    }));
  };

  const removeItem = (itemId) => {
    if (editedOrder.items.length === 1) {
      alert('Order must have at least one item');
      return;
    }
    setEditedOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const addProduct = (productId) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = editedOrder.items.find(item => item.id === product.id);
    if (existingItem) {
      updateItemQuantity(product.id, 1);
    } else {
      setEditedOrder(prev => ({
        ...prev,
        items: [...prev.items, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sku: product.sku,
        }],
      }));
    }
  };

  const calculateSubtotal = () => {
    return editedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + parseFloat(shippingCharge || 0);
  };

  const handleSave = () => {
    const updatedOrder = {
      ...editedOrder,
      shippingCharge: parseFloat(shippingCharge || 0),
      notes,
      total: calculateTotal(),
    };
    onSave(updatedOrder);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order #{editedOrder.id?.substring(0, 8)}</DialogTitle>
          <DialogDescription>
            Modify quantities, prices, add/remove products, and add shipping charges
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p className="text-sm"><strong>Email:</strong> {editedOrder.userEmail}</p>
            <p className="text-sm"><strong>Order Date:</strong> {new Date(editedOrder.createdAt).toLocaleDateString()}</p>
            <p className="text-sm"><strong>Status:</strong> <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">{editedOrder.status}</span></p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {editedOrder.items.map((item, index) => (
                <div key={index} className="border rounded-md p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Qty:</Label>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateItemQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        setEditedOrder(prev => ({
                          ...prev,
                          items: prev.items.map(i =>
                            i.id === item.id ? { ...i, quantity: qty } : i
                          ),
                        }));
                      }}
                      className="w-16 h-8 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateItemQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Price:</Label>
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItemPrice(item.id, e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="font-semibold w-24 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Product */}
          <div className="border-t pt-4">
            <Label className="mb-2 block">Add Product to Order</Label>
            <Select onValueChange={addProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product to add" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ${product.price} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shipping & Totals */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal:</span>
              <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="shipping">Shipping Charges:</Label>
              <div className="flex items-center gap-1">
                <span>$</span>
                <Input
                  id="shipping"
                  type="number"
                  step="0.01"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(e.target.value)}
                  className="w-32"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total:</span>
              <span className="text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="mb-2 block">Order Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this order..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
