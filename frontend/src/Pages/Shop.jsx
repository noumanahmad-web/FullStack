import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";

function Shop({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isShopPage = location.pathname === "/shop";

  // =========================
  // SEARCH & CATEGORY FILTER
  // =========================

  const categoryFilter = searchParams.get("category") || "";

  const searchFilter =
    searchTerm || searchParams.get("search") || "";

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products:", data);

        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);

        setError(
          "Products load nahi ho sake. Backend server check karein."
        );

        setLoading(false);
      });
  }, []);

  // =========================
  // HOME SHOP SCROLL
  // =========================

  useEffect(() => {
    if (!loading && location.hash === "#shop") {
      document.getElementById("shop")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, location.hash]);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products.filter((product) => {
    const search = searchFilter.trim().toLowerCase();
    const category = categoryFilter.trim().toLowerCase();

    // Search filter
    const matchesSearch =
      !search ||
      product.name?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search);

    // Category filter
    const matchesCategory =
      !category ||
      product.category?.trim().toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section
        id="shop"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <section
        id="shop"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
      >
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">
            Shop unavailable
          </h2>

          <p className="mt-3 text-gray-500">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="shop"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
    >
      {/* =========================
          SECTION HEADER
      ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 mb-2">
            {categoryFilter
              ? "Category Collection"
              : "Our Collection"}
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {categoryFilter
              ? `${categoryFilter} Collection`
              : "Shop Our Products"}
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl">
            {categoryFilter
              ? `Explore our latest ${categoryFilter} products.`
              : "Discover our latest collection of premium products, carefully selected for quality, style and everyday comfort."}
          </p>
        </div>

        {/* Product Count */}
        <div className="text-sm text-gray-500">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "Product"
            : "Products"}
        </div>
      </div>

      {/* =========================
          ACTIVE CATEGORY
      ========================= */}

      {categoryFilter && (
        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Showing:
          </span>

          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            {categoryFilter}
          </span>

          <Link
            to="/shop"
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Clear Filter
          </Link>
        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(isShopPage
            ? filteredProducts
            : filteredProducts.slice(0, 4)
          ).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">
            🛍️
          </div>

          <h3 className="text-xl font-semibold text-gray-900">
            No Products Found
          </h3>

          <p className="text-gray-500 mt-2">
            Is category mein abhi koi product available nahi hai.
          </p>

          <Link
            to="/shop"
            className="inline-flex mt-6 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
          >
            View All Products
          </Link>
        </div>
      )}

      {/* =========================
          EXPLORE ALL PRODUCTS
      ========================= */}

      {!isShopPage &&
        filteredProducts.length > 4 && (
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