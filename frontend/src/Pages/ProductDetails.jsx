import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
function ProductDetails() {
  const [cartMessage, setCartMessage] = useState("");

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
        );

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
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-130 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-start">
          <p className="text-blue-600 font-medium mb-3">{product.category}</p>

          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-3xl font-bold text-gray-900 mt-6">
            Rs. {product.price}
          </p>

          <p className="text-gray-600 leading-7 mt-6">{product.description}</p>

          <p className="text-gray-500 mt-6">
            Stock available:{" "}
            <span className="font-semibold text-gray-900">{product.stock}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              addToCart(product);
          setTimeout(() => {
      navigate("/cart");
    }, 300);        
            }}
            className="mt-8 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>

          {cartMessage && (
            <p className="mt-4 text-green-600 font-medium">✓ {cartMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
