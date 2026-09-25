import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm p-8 sm:p-12 text-center">

        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle
            size={80}
            className="text-green-500"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mt-6">
          Order Placed Successfully! 🎉
        </h1>

        <p className="text-gray-500 mt-3">
          Thank you for your order. We have received your order
          and will process it shortly.
        </p>

        {/* Order ID */}
        {order?._id && (
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="font-semibold text-gray-900 mt-1 break-all">
              {order._id}
            </p>
          </div>
        )}

        {/* Total */}
        {order?.total !== undefined && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Total Amount
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              Rs. {order.total.toLocaleString()}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mt-6 text-gray-600">
          <Package size={20} />

          <span>
            Your order is being processed
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">

          <Link
            to="/"
            className="bg-gray-900 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-600 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;