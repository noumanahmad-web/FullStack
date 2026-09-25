import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar({
  onSignupClick,
  searchTerm,
  onSearchChange,
  isLoggedIn,
  onLogout,
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const { cartCount } = useCart();
  const navigate = useNavigate();

  // =========================
  // CLOSE MOBILE MENU
  // =========================

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogoutClick = async () => {
    closeMobileMenu();
    await onLogout();
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchTerm?.trim();

    if (!value) {
      navigate("/shop");
      closeMobileMenu();
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(value)}`);

    closeMobileMenu();
  };

  // =========================
  // HOME SECTION NAVIGATION
  // =========================

  const handleHomeSection = (section) => {
    closeMobileMenu();

    navigate(`/#${section}`);

    setTimeout(() => {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================
            MAIN NAVBAR
        ========================= */}

        <div className="h-20 flex items-center justify-between gap-4">

          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-2xl font-bold tracking-tight text-gray-900 shrink-0"
          >
            SHOP<span className="text-blue-600">STORE</span>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}

          <div className="hidden lg:flex items-center gap-7">

            {/* HOME */}

            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>

            {/* SHOP */}

            <Link
              to="/#shop"
              onClick={(event) => {
                event.preventDefault();
                handleHomeSection("shop");
              }}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Shop
            </Link>

            {/* CATEGORIES */}

            <button
              type="button"
              onClick={() => handleHomeSection("categories")}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Categories
            </button>

            {/* NEW ARRIVALS */}

            <button
              type="button"
              onClick={() => handleHomeSection("new-arrivals")}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              New Arrivals
            </button>

            {/* MY ORDERS */}

            <Link
              to="/orders"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              My Orders
            </Link>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="flex items-center gap-2 sm:gap-4">

            {/* SEARCH */}

            <form
              onSubmit={handleSearch}
              className="hidden md:block"
            >
              <div className="relative">

                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm || ""}
                  onChange={(e) =>
                    onSearchChange(e.target.value)
                  }
                  placeholder="Search products..."
                  className="w-48 bg-gray-100 border border-transparent rounded-full py-2.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            </form>

            {/* CART */}

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={21} />

              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* =========================
                DESKTOP AUTH
            ========================= */}

            {isLoggedIn ? (

              <button
                onClick={handleLogoutClick}
                className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-600 transition"
              >
                <LogOut size={16} />
                Logout
              </button>

            ) : (

              <button
                onClick={onSignupClick}
                className="hidden sm:block bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
              >
                Signup
              </button>

            )}

            {/* MOBILE MENU BUTTON */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2 text-gray-700"
              aria-label="Menu"
            >
              {mobileMenu ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>

        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        {mobileMenu && (
          <div className="lg:hidden border-t border-gray-100 py-5">

            <div className="flex flex-col gap-4">

              {/* HOME */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Home
              </Link>

              {/* SHOP */}

              <Link
                to="/#shop"
                onClick={(event) => {
                  event.preventDefault();
                  handleHomeSection("shop");
                }}
                className="text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Shop
              </Link>

              {/* CATEGORIES */}

              <button
                type="button"
                onClick={() =>
                  handleHomeSection("categories")
                }
                className="text-left text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Categories
              </button>

              {/* NEW ARRIVALS */}

              <button
                type="button"
                onClick={() =>
                  handleHomeSection("new-arrivals")
                }
                className="text-left text-gray-700 font-medium hover:text-blue-600 transition"
              >
                New Arrivals
              </button>

              {/* MY ORDERS */}

              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className="text-gray-700 font-medium hover:text-blue-600 transition"
              >
                My Orders
              </Link>

              {/* MOBILE SEARCH */}

              <form
                onSubmit={handleSearch}
                className="pt-2"
              >
                <div className="relative">

                  <Search
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm || ""}
                    onChange={(e) =>
                      onSearchChange(e.target.value)
                    }
                    placeholder="Search products..."
                    className="w-full bg-gray-100 rounded-full py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    aria-label="Search products"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 transition"
                  >
                    <Search size={18} />
                  </button>

                </div>
              </form>

              {/* MOBILE CART */}

              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="border border-gray-200 text-gray-900 text-center py-3 rounded-full font-medium hover:bg-gray-50 transition"
              >
                Shopping Cart ({cartCount})
              </Link>

              {/* =========================
                  MOBILE AUTH
              ========================= */}

              {isLoggedIn ? (

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-red-600 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              ) : (

                <button
                  onClick={() => {
                    closeMobileMenu();
                    onSignupClick();
                  }}
                  className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-blue-600 transition"
                >
                  Signup
                </button>

              )}

            </div>

          </div>
        )}

      </nav>
    </header>
  );
}

export default Navbar;