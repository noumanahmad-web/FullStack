import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        console.log("Products API:", data);

        if (data.success) {
          const latestProducts = [...data.products]
            .sort(
              (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            )
            .slice(0, 4);

          setProducts(latestProducts);
        }
      } catch (error) {
        console.error("New Arrivals Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section
      id="new-arrivals"
      className="bg-gray-50 border-y border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Just Arrived
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              New Arrivals
            </h2>

            <p className="text-gray-500 mt-3">
              Discover the latest products added to our collection.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition"
          >
            Shop All →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-96 bg-white rounded-3xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 group hover:shadow-xl transition duration-300"
              >
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    NEW
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {product.name}
                  </h3>

                  <p className="text-blue-600 font-bold text-lg mt-2">
                    Rs. {Number(product.price).toLocaleString()}
                  </p>

                  <Link
                    to={`/product/${product._id}`}
                    className="block text-center mt-4 bg-gray-900 text-white py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              No new products available.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default NewArrivals;

