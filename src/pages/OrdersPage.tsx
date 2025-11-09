import React, { useState } from 'react';
import { Search, Eye, X, CheckCircle, Truck, Package, Clock, ShoppingBag } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { Order, OrderFilterType } from '../types';
import { mockOrders } from '../data/mockData';

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<OrderFilterType>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const filterTabs = [
    { id: 'all' as OrderFilterType, label: 'All Orders', count: mockOrders.length },
    { id: 'pending' as OrderFilterType, label: 'Pending', count: mockOrders.filter(o => o.status === 'pending').length },
    { id: 'processing' as OrderFilterType, label: 'Processing', count: mockOrders.filter(o => o.status === 'processing').length },
    { id: 'shipped' as OrderFilterType, label: 'Shipped', count: mockOrders.filter(o => o.status === 'shipped').length },
    { id: 'delivered' as OrderFilterType, label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'processing': return <Package className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-black text-white';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Manage Orders</h2>
        <p className="text-gray-600 text-sm mt-1">View and manage all customer orders</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <SearchBar
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-medium text-black">{filteredOrders.length}</span> orders
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-medium text-black">{order.id}</td>
                  <td className="py-3 px-2 text-sm text-gray-900">{order.user}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">{order.date}</td>
                  <td className="py-3 px-2 text-sm font-medium text-black text-right">{order.amount}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1 text-sm text-black hover:underline font-medium"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No orders found matching your search.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-black">Order Details</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status.toUpperCase()}
                  </span>
                  <p className="text-2xl font-bold text-black">{selectedOrder.amount}</p>
                </div>
                {selectedOrder.trackingNumber && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                    <p className="text-sm text-black font-mono">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Name</p>
                    <p className="text-sm text-black">{selectedOrder.user}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">User ID</p>
                    <p className="text-sm text-black font-mono">{selectedOrder.userId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                    <p className="text-sm text-black">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-lg">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">{item}</p>
                          <p className="text-xs text-gray-600">Quantity: 1</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-black">{selectedOrder.amount}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-black font-medium">Order Placed</p>
                      <p className="text-xs text-gray-600">{selectedOrder.date}</p>
                    </div>
                  </div>
                  {selectedOrder.status !== 'pending' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-black font-medium">Processing Started</p>
                        <p className="text-xs text-gray-600">{selectedOrder.date}</p>
                      </div>
                    </div>
                  )}
                  {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-black font-medium">Shipped</p>
                        <p className="text-xs text-gray-600">{selectedOrder.date}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-black font-medium">Delivered</p>
                        <p className="text-xs text-gray-600">{selectedOrder.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;