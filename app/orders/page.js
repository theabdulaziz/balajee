'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import OrderTable from '@/components/OrderTable';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <OrderTable 
                orders={orders}
                onViewOrder={(order) => {
                  setSelectedOrder(order);
                  setShowOrderDetails(true);
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        <OrderDetailsModal
          open={showOrderDetails}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}