import { useState } from "react";
import { apiFetch } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const orderData = {
      customer: formData,
      items: cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: cartTotal,
      shipping: 0,
      total: cartTotal,
      paymentMethod: "cod",
    };

    const response = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (data.success) {
      clearCart();

      navigate("/order-success", {
        state: {
          order: data.order,
        },
      });
    } else {
      alert(data.message || "Order failed");
    }
  } catch (error) {
    console.error("Order Error:", error);
    alert("Something went wrong while placing the order.");
  }
};

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add some products before checkout.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>

      <p className="text-gray-500 mt-2 mb-8">
        Enter your information to complete your order.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Shipping Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Islamabad"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="4"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="44000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>

                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>

                <p className="font-semibold">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 my-6" />

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-600 mt-3">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="border-t border-gray-200 my-5" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
