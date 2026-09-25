import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
} from "lucide-react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin session not found. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      console.log("ORDERS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("ORDERS ERROR:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin session not found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      console.log("UPDATE STATUS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      // Update orders table
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order.status }
            : order,
        ),
      );

      // Update selected order inside modal
      setSelectedOrder((prevOrder) =>
        prevOrder && prevOrder._id === orderId
          ? { ...prevOrder, status: data.order.status }
          : prevOrder,
      );
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      setError(error.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Stats
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length;

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase().trim();

    const orderId = order._id?.toLowerCase() || "";

    const customerName =
      order.user?.name?.toLowerCase() ||
      order.customer?.name?.toLowerCase() ||
      "";

    const customerEmail =
      order.user?.email?.toLowerCase() ||
      order.customer?.email?.toLowerCase() ||
      "";

    const matchesSearch =
      !search ||
      orderId.includes(search) ||
      customerName.includes(search) ||
      customerEmail.includes(search);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "confirmed":
        return "bg-blue-50 text-blue-700";

      case "processing":
        return "bg-purple-50 text-purple-700";

      case "shipped":
        return "bg-indigo-50 text-indigo-700";

      case "delivered":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Store Management
              </p>

              <h1 className="text-3xl font-bold text-gray-900 mt-1">Orders</h1>

              <p className="text-gray-500 mt-1">
                View and manage customer orders.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Total Orders */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <ShoppingCart size={20} className="text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500">Total Orders</p>

                  <p className="font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
                title="Refresh orders"
              >
                <RefreshCw
                  size={19}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {totalOrders}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <ShoppingCart size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {pendingOrders}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {completedOrders}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {cancelledOrders}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Heading */}
              <div>
                <h2 className="text-lg font-bold text-gray-900">All Orders</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Customer orders will appear here.
                </p>
              </div>

              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-44 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Result Count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {orders.length}
              </span>{" "}
              orders
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="text-gray-500 mt-4">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            /* Empty */
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
                <ShoppingCart size={28} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-5">
                No orders yet
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Order ID
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                      Action
                    </th>
                  </tr>
                </thead>

              <tbody className="divide-y divide-gray-100">
  {filteredOrders.length === 0 ? (
    <tr>
      <td colSpan="6" className="px-6 py-16 text-center">
        <Search
          size={32}
          className="mx-auto text-gray-300"
        />

        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No matching orders
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Try a different search or status filter.
        </p>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
          }}
          className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-blue-600 transition"
        >
          Clear Filters
        </button>
      </td>
    </tr>
  ) : (
    filteredOrders.map((order) => (
      <tr
        key={order._id}
        className="hover:bg-gray-50 transition"
      >
        {/* Order ID */}
        <td className="px-6 py-4">
          <p className="font-medium text-gray-900">
            #{order._id?.slice(-8)}
          </p>
        </td>

        {/* Customer */}
        <td className="px-6 py-4">
          <p className="font-medium text-gray-900">
            {order.user?.name ||
              order.customer?.name ||
              "Customer"}
          </p>

          <p className="text-sm text-gray-500">
            {order.user?.email ||
              order.customer?.email ||
              ""}
          </p>
        </td>

        {/* Amount */}
        <td className="px-6 py-4">
          <p className="font-semibold text-gray-900">
            Rs. {Number(order.total || 0).toLocaleString()}
          </p>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <select
            value={order.status || "pending"}
            onChange={(e) =>
              updateOrderStatus(
                order._id,
                e.target.value
              )
            }
            disabled={updatingStatus}
            className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize border-0 outline-none cursor-pointer ${getStatusStyle(
              order.status
            )}`}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>

        {/* Date */}
        <td className="px-6 py-4 text-sm text-gray-600">
          {formatDate(order.createdAt)}
        </td>

        {/* Action */}
        <td className="px-6 py-4 text-right">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-blue-600 transition"
            onClick={() => setSelectedOrder(order)}
          >
            <Eye size={16} />
            View
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
              {/* ================= ORDER DETAILS MODAL ================= */}

              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">
                          Order Details
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-1">
                          #{selectedOrder._id?.slice(-8)}
                        </h2>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xl"
                      >
                        ×
                      </button>
                    </div>

                    {/* Customer Information */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Customer
                          </p>

                          <p className="font-semibold text-gray-900 mt-2">
                            {selectedOrder.user?.name ||
                              selectedOrder.customer?.name ||
                              "Customer"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {selectedOrder.user?.email ||
                              selectedOrder.customer?.email ||
                              "No email"}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Order Date
                          </p>

                          <p className="font-semibold text-gray-900 mt-2">
                            {formatDate(selectedOrder.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-bold text-gray-900">
                            Ordered Products
                          </h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                          {selectedOrder.items?.map((item, index) => {
                            const product = item.product;

                            const productName =
                              product?.name || item.name || "Product";

                            const quantity = item.quantity || 1;

                            const price = Number(
                              item.price || product?.price || 0,
                            );

                            return (
                              <div
                                key={item._id || index}
                                className="p-5 flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-4">
                                  {/* Product Image */}
                                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {product?.image ? (
                                      <img
                                        src={product.image}
                                        alt={productName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <ShoppingCart
                                        size={22}
                                        className="text-gray-400"
                                      />
                                    )}
                                  </div>

                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {productName}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                      Quantity: {quantity}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    Rs. {price.toLocaleString()}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Rs. {price.toLocaleString()} × {quantity}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 border border-gray-200 rounded-xl p-5">
                        <h3 className="font-bold text-gray-900 mb-4">
                          Order Summary
                        </h3>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>

                            <span className="font-medium text-gray-900">
                              Rs.{" "}
                              {Number(
                                selectedOrder.subtotal || 0,
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>

                            <span className="font-medium text-gray-900">
                              Rs.{" "}
                              {Number(
                                selectedOrder.shipping || 0,
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 pt-3 flex justify-between">
                            <span className="font-bold text-gray-900">
                              Total
                            </span>

                            <span className="font-bold text-lg text-blue-600">
                              Rs.{" "}
                              {Number(
                                selectedOrder.total || 0,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment + Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                        <div className="border border-gray-200 rounded-xl p-5">
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Payment Method
                          </p>

                          <p className="font-semibold text-gray-900 mt-2 capitalize">
                            {selectedOrder.paymentMethod || "N/A"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Payment Status:{" "}
                            <span className="font-semibold capitalize">
                              {selectedOrder.paymentStatus || "pending"}
                            </span>
                          </p>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-5">
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Order Status
                          </p>

                          <div className="mt-3">
                            <select
                              value={selectedOrder.status || "pending"}
                              onChange={(e) =>
                                updateOrderStatus(
                                  selectedOrder._id,
                                  e.target.value,
                                )
                              }
                              disabled={updatingStatus}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {updatingStatus && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <RefreshCw size={15} className="animate-spin" />
                                Updating status...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
