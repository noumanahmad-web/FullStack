import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";

function Shop({ searchTerm }) {


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const isShopPage = location.pathname === "/shop";

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        console.log("Response:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Products:", data);

        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setError("Products load nahi ho sake. Backend server check karein.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && location.hash === "#shop") {
      document.getElementById("shop")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, location.hash]);

const filteredProducts = products.filter((product) => {
  const search = (searchTerm || "").toLowerCase();

  return (
    product.name?.toLowerCase().includes(search) ||
    product.category?.toLowerCase().includes(search) ||
    product.description?.toLowerCase().includes(search)
  );
});
  if (loading) {
    return (
      <div className="text-center py-20">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">Shop unavailable</h2>
          <p className="mt-3 text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
   <section
  id="shop"
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
>
  {/* Section Header */}
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">

    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">
        Our Collection
      </p>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Shop Our Products
      </h2>

      <p className="text-gray-500 mt-3 max-w-xl">
        Discover our latest collection of premium products, carefully selected
        for quality, style and everyday comfort.
      </p>
    </div>

    {/* View All Button */}
    <Link
      to="/shop"
      className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all duration-300 shrink-0"
    >
      View All Products
      <span>→</span>
    </Link>

  </div>

  {/* Products */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

    {filteredProducts.length > 0 ? (
      (isShopPage ? filteredProducts : filteredProducts.slice(0, 4)).map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))
    ) : (
      <p className="col-span-full py-12 text-center text-gray-500">
        Abhi koi products available nahi hain.
      </p>
    )}

  </div>

  {/* Bottom Button */}
  {!isShopPage && filteredProducts.length > 4 && (
    <div className="flex justify-center mt-12">
      <Link
        to="/shop"
        className="group inline-flex items-center gap-3 border border-gray-900 text-gray-900 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
      >
        Explore All Products

        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </Link>
    </div>
  )}

</section>
  );
}
export default Shop;