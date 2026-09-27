import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);

        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_URL]);

  // Select an option value
  const handleAttributeSelect = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  // Check if all options are selected
  const allAttributesSelected =
    !product?.attributes?.length ||
    product.attributes.every(
      (attribute) => selectedAttributes[attribute.name]
    );

  // Add product to cart
  const handleAddToCart = () => {
    if (!allAttributesSelected) {
      setCartMessage("Please select all product options.");
      return;
    }

    const cartProduct = {
      ...product,
      quantity,
      selectedAttributes,
    };

    addToCart(cartProduct);

    setCartMessage("Product added to cart!");

    setTimeout(() => {
      navigate("/cart");
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Product not found
          </h2>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-gray-900"
          >
            Home
          </span>

          <span className="mx-2">/</span>

          <span
            onClick={() => navigate("/shop")}
            className="cursor-pointer hover:text-gray-900"
          >
            Shop
          </span>

          <span className="mx-2">/</span>

          <span className="text-gray-900 font-medium">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ================= IMAGE ================= */}
          <div>
            <div className="relative bg-gray-100 rounded-3xl overflow-hidden group">

              {/* Category Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                  {product.category}
                </span>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] md:h-[600px] object-cover group-hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          {/* ================= PRODUCT INFO ================= */}
          <div className="flex flex-col">

            {/* Category */}
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 font-semibold">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-6 flex items-center gap-4">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                Rs. {Number(product.price).toLocaleString()}
              </p>

              {product.stock > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-7 mt-6 text-base md:text-lg">
              {product.description}
            </p>

            <div className="border-t border-gray-200 mt-8 pt-8">

              {/* ================= DYNAMIC OPTIONS ================= */}
              {product.attributes?.length > 0 && (
                <div className="space-y-7">

                  {product.attributes.map((attribute, attributeIndex) => (
                    <div key={attribute._id || attributeIndex}>

                      {/* Option Name */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-900">
                          {attribute.name}
                        </h3>

                        {selectedAttributes[attribute.name] && (
                          <span className="text-sm text-gray-500">
                            Selected:{" "}
                            <span className="font-semibold text-gray-900">
                              {selectedAttributes[attribute.name]}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Option Values */}
                      <div className="flex flex-wrap gap-3">

                        {attribute.values.map((value, valueIndex) => {
                          const isSelected =
                            selectedAttributes[attribute.name] === value;

                          return (
                            <button
                              key={valueIndex}
                              type="button"
                              onClick={() =>
                                handleAttributeSelect(
                                  attribute.name,
                                  value
                                )
                              }
                              className={`
                                px-5 py-3 rounded-xl border-2
                                font-medium text-sm
                                transition-all duration-200
                                ${
                                  isSelected
                                    ? "border-gray-900 bg-gray-900 text-white shadow-md"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-900"
                                }
                              `}
                            >
                              {value}
                            </button>
                          );
                        })}

                      </div>
                    </div>
                  ))}

                </div>
              )}

              {/* ================= QUANTITY ================= */}
              <div className="mt-8">

                <h3 className="text-base font-bold text-gray-900 mb-3">
                  Quantity
                </h3>

                <div className="flex items-center w-fit border border-gray-300 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 transition"
                  >
                    −
                  </button>

                  <span className="w-14 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.stock, prev + 1)
                      )
                    }
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 transition disabled:opacity-40"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* ================= STOCK ================= */}
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  {product.stock > 0
                    ? `${product.stock} items available`
                    : "Out of stock"}
                </p>
              </div>

              {/* ================= ADD TO CART ================= */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  product.stock <= 0 || !allAttributesSelected
                }
                className={`
                  w-full mt-7 py-4 rounded-xl
                  font-bold text-lg
                  transition-all duration-300
                  ${
                    product.stock <= 0 || !allAttributesSelected
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-xl"
                  }
                `}
              >
                {product.stock <= 0
                  ? "Out of Stock"
                  : !allAttributesSelected
                  ? "Select All Options"
                  : "Add to Cart"}
              </button>

              {/* Success / Error Message */}
              {cartMessage && (
                <div
                  className={`mt-4 p-4 rounded-xl text-center font-medium ${
                    cartMessage.includes("added")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {cartMessage}
                </div>
              )}

              {/* Product Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <p className="font-semibold text-gray-900 text-sm">
                    Premium Quality
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Quality guaranteed
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <p className="font-semibold text-gray-900 text-sm">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Safe checkout
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <p className="font-semibold text-gray-900 text-sm">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Quick shipping
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;