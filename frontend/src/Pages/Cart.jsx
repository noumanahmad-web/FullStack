import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">

          <ShoppingBag
            size={64}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-3xl font-bold text-gray-900 mt-6">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        <p className="text-gray-500 mt-2">
          Review your items before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">

          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5"
            >

              {/* Image */}
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">

                <p className="text-sm text-gray-500">
                  {item.category}
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {item.name}
                </h2>

                <p className="text-gray-900 font-bold mt-2">
                  Rs. {item.price.toLocaleString()}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-4">

                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold min-w-[25px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>

                </div>

              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="self-start text-gray-400 hover:text-red-500 transition"
                aria-label="Remove product"
              >
                <Trash2 size={20} />
              </button>

            </div>
          ))}

        </div>

        {/* Summary */}
        <div className="lg:col-span-1">

          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">

            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="flex justify-between mt-6 text-gray-600">
              <span>Subtotal</span>

              <span>
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between mt-3 text-gray-600">
              <span>Shipping</span>

              <span className="text-green-600">
                Free
              </span>
            </div>

            <div className="border-t border-gray-200 my-5" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>

            <Link
  to="/checkout"
  className="block w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-semibold text-center hover:bg-blue-600 transition"
>
  Proceed to Checkout
</Link>

            <Link
              to="/"
              className="block text-center mt-4 text-gray-600 hover:text-blue-600"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;