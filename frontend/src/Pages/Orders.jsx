import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

function Orders() {
  console.log("ORDERS PAGE LOADED");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("FETCHING ORDERS...");

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }

        const response = await apiFetch("/orders", {
          method: "GET",
        });

        const data = await response.json();

        console.log("ORDERS API RESPONSE:", data);

        if (response.ok && data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Orders Error:", error);
        setError("Something went wrong while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

          <Link
            to="/"
            className="inline-block mt-5 bg-gray-900 text-white px-6 py-3 rounded-full"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            No Orders Yet
          </h1>

          <p className="text-gray-500 mt-2">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          My Orders
        </h1>

        <p className="text-gray-500 mt-2">
          View your recent orders and their status.
        </p>
      </div>

      {/* Orders */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
          >
            {/* Order Header */}
            <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold text-gray-900 break-all">
                  #{order._id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Date
                </p>

                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span className="inline-block mt-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="p-5 space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={`${order._id}-${index}`}
                  className="flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-sm text-gray-500">
                      Rs. {item.price.toLocaleString()} each
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    Rs.{" "}
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Payment
                </p>

                <p className="font-medium text-gray-900 uppercase">
                  {order.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  Rs. {order.total.toLocaleString()}
                </p>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="bg-gray-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-600 transition text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;