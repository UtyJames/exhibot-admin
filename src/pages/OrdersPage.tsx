// src/pages/OrdersPage.tsx
import React, { useState } from 'react';
import { Search, Eye, X, Package, MapPin, User, Calendar, RefreshCw, AlertCircle, Download, CreditCard } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { useCarts } from '../hooks/useCarts';

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { carts, pagination, isLoading, error, refetch, changePage } = useCarts({
    page: currentPage,
    limit: 20,
  });

  const filteredCarts = carts.filter(cart => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      cart.firstName.toLowerCase().includes(searchLower) ||
      cart.lastName.toLowerCase().includes(searchLower) ||
      cart.shippingAddress.toLowerCase().includes(searchLower) ||
      cart.country.toLowerCase().includes(searchLower) ||
      cart.product.productName.toLowerCase().includes(searchLower) ||
      cart.userId.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (price: string) => {
    const amount = parseInt(price);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getOrderStatus = (order: CartOrder) => {
    // Since the API doesn't provide order status, we can determine it based on creation date
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return { status: 'processing', color: 'bg-yellow-100 text-yellow-800' };
    if (diffDays < 3) return { status: 'shipped', color: 'bg-blue-100 text-blue-800' };
    return { status: 'delivered', color: 'bg-green-100 text-green-800' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return '⏳';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      default: return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Manage Cart Orders</h2>
        <p className="text-gray-600 text-sm mt-1">View and manage all bracelet orders</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Search and Actions */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by customer name, address, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={refetch}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-black">{filteredCarts.length}</span> of{' '}
            <span className="font-medium text-black">{pagination.total}</span> orders
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to Load Orders</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredCarts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No orders found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCarts.map(cart => {
              const status = getOrderStatus(cart);
              
              return (
                <div 
                  key={cart._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(cart)}
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={cart.product.productImg}
                        alt={cart.product.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            {cart.firstName} {cart.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">User ID: {cart.userId}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {getStatusIcon(status.status)} {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                          </span>
                          <span className="text-lg font-bold text-black">
                            {formatCurrency(cart.product.productPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 font-medium">{cart.product.productName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{cart.shippingAddress}, {cart.country}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Ordered: {formatDate(cart.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Zip: {cart.zipCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(cart);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPage = pagination.page - 1;
                  setCurrentPage(newPage);
                  changePage(newPage);
                }}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const newPage = pagination.page + 1;
                  setCurrentPage(newPage);
                  changePage(newPage);
                }}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

// Order Detail Modal Component
interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (price: string) => {
    const amount = parseInt(price);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getOrderStatus = (order: any) => {
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return { status: 'processing', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
    if (diffDays < 3) return { status: 'shipped', color: 'bg-blue-100 text-blue-800', icon: '🚚' };
    return { status: 'delivered', color: 'bg-green-100 text-green-800', icon: '✅' };
  };

  const status = getOrderStatus(order);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-black">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">Order ID: {order._id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
                  <span className="text-lg">{status.icon}</span>
                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </span>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-sm font-medium text-black">{formatDate(order.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-black">{formatCurrency(order.product.productPrice)}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-3">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-black">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs text-gray-600">Customer</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">User ID</p>
                  <p className="text-sm text-black font-mono">{order.userId}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-3">Shipping Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-black">{order.shippingAddress}</p>
                    <p className="text-xs text-gray-600">
                      {order.country} - {order.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Product Information</h3>
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4 p-4">
                <img
                  src={order.product.productImg}
                  alt={order.product.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">{order.product.productName}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.product.productDesc}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black">{formatCurrency(order.product.productPrice)}</p>
                  <p className="text-xs text-gray-600">Unit Price</p>
                </div>
              </div>
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
                  <p className="text-xs text-gray-600">{formatDate(order.created_at)}</p>
                </div>
              </div>
              {status.status !== 'processing' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-black font-medium">Processing Started</p>
                    <p className="text-xs text-gray-600">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              )}
              {(status.status === 'shipped' || status.status === 'delivered') && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-black font-medium">Shipped</p>
                    <p className="text-xs text-gray-600">
                      {new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {status.status === 'delivered' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-black font-medium">Delivered</p>
                    <p className="text-xs text-gray-600">
                      {new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;