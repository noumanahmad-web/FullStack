import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">

        <p className="text-sm text-gray-500 mb-1">
          {product.category}
        </p>

        <h3 className="text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">

          <span className="text-xl font-bold text-gray-900">
            Rs. {product.price.toLocaleString()}
          </span>

          <button
            onClick={handleViewDetails}
            className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition"
          >
            View Details
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;