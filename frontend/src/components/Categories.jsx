import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      name: "T-Shirts",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17a5",
    },
    {
      name: "Hoodies",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    },
    {
      name: "Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d",
    },
    {
      name: "Jackets",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    },
  ];

  return (
    <section
      id="categories"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Shop By Category
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
          Explore Our Categories
        </h2>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Discover your favorite styles and explore our latest collections.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="group relative h-72 overflow-hidden rounded-3xl bg-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white">
                {category.name}
              </h3>

              <p className="text-white/80 text-sm mt-2 group-hover:text-white transition">
                Explore Collection
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;