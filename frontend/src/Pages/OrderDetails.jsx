import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view this order.");
          setLoading(false);
          return;
        }

        const response = await apiFetch(`/orders/${id}`, {
          method: "GET",
        });

        const data = await response.json();

        console.log("ORDER DETAILS API RESPONSE:", data);

        if (response.ok && data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || "Order not found");
        }
      } catch (error) {
        console.error("Order Details Error:", error);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-5">{error || "Order not found"}</p>

          <Link
            to="/orders"
            className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = statuses.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Order Details</h1>

          <p className="text-gray-500 mt-2 break-all">Order #{order._id}</p>
        </div>

        <Link
          to="/orders"
          className="bg-gray-100 text-gray-900 px-5 py-3 rounded-xl font-medium hover:bg-gray-200 transition text-center"
        >
          Back to Orders
        </Link>
      </div>

      {/* Order Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Order Date</p>

            <p className="font-semibold mt-1">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>

            <span className="inline-block mt-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {order.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment</p>

            <p className="font-semibold mt-1 uppercase">
              {order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Order Tracking</h2>

        {isCancelled ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
              ×
            </div>

            <h3 className="mt-4 text-lg font-bold text-red-700">
              Order Cancelled
            </h3>

            <p className="mt-1 text-sm text-red-600">
              This order has been cancelled by the store.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {statuses.map((status, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={status} className="text-center">
                  <div
                    className={`mx-auto w-11 h-11 rounded-full flex items-center justify-center font-bold transition ${
                      isCompleted
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-500"
                    } ${isCurrent ? "ring-4 ring-gray-200" : ""}`}
                  >
                    {index + 1}
                  </div>

                  <p
                    className={`mt-2 text-sm font-medium capitalize ${
                      isCompleted ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {status}
                  </p>

                  {isCurrent && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      Current
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-5">Customer Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-sm text-gray-500">Name</p>

            <p className="font-medium">{order.customer.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="font-medium">{order.customer.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>

            <p className="font-medium">{order.customer.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">City</p>

            <p className="font-medium">{order.customer.city}</p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Address</p>

            <p className="font-medium">{order.customer.address}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-5">Ordered Products</h2>

        <div className="space-y-5">
          {order.items.map((item, index) => (
            <div
              key={`${order._id}-${index}`}
              className="flex items-center gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-gray-100"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Quantity: {item.quantity}
                </p>

                <p className="text-sm text-gray-500">
                  Rs. {item.price.toLocaleString()} each
                </p>
              </div>

              <p className="font-semibold text-gray-900">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-900 text-white rounded-2xl p-6">
        <div className="flex justify-between items-center gap-4">
          <span className="text-lg">Order Total</span>

          <span className="text-3xl font-bold">
            Rs. {order.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
