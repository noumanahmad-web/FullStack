import { ArrowUp, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12 md:py-16 lg:px-10">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <ShoppingBag size={18} aria-hidden="true" />
            </span>
            <span>SHOP<span className="text-blue-400">STORE</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
            Find your next everyday favorite in our latest collection.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore the shop
          </Link>
        </div>

        <nav aria-label="Shop links">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li><Link className="transition hover:text-white" to="/shop">All products</Link></li>
            <li><Link className="transition hover:text-white" to="/#categories">Categories</Link></li>
            <li><Link className="transition hover:text-white" to="/#new-arrivals">New arrivals</Link></li>
          </ul>
        </nav>

        <nav aria-label="Customer links">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Your account</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li><Link className="transition hover:text-white" to="/orders">My orders</Link></li>
            <li><Link className="transition hover:text-white" to="/cart">Shopping cart</Link></li>
            <li><Link className="transition hover:text-white" to="/#shop">Shop the collection</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 text-sm text-gray-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {year} SHOPSTORE. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex w-fit items-center gap-2 text-gray-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;