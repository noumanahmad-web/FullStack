import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Settings,
  Store,
  Menu,
  X,
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================
  // ADMIN INFORMATION
  // =========================

  const savedAdmin = localStorage.getItem("admin");

  const admin = savedAdmin
    ? JSON.parse(savedAdmin)
    : null;

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login", { replace: true });
  };

  // =========================
  // NAVIGATION STYLE
  // =========================

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
      isActive
        ? "bg-white text-gray-950 shadow-sm"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`;

  // =========================
  // ADMIN INITIAL
  // =========================

  const adminInitial = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= SIDEBAR ================= */}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-gray-950 text-white transition-transform duration-300 lg:z-40 lg:w-64 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        {/* ================= LOGO ================= */}

        <div className="h-20 flex items-center px-6 border-b border-white/10">

          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Store
              size={20}
              className="text-gray-950"
            />
          </div>

          <div className="ml-3">

            <h1 className="font-bold text-lg">
              AdminPanel
            </h1>

            <p className="text-xs text-gray-400">
              Store Management
            </p>

          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>

        </div>

        {/* ================= NAVIGATION ================= */}

        <nav
          className="flex-1 px-4 py-6 space-y-2"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Admin navigation"
        >

          {/* Dashboard */}

          <NavLink
            to="/admin"
            end
            className={navLinkClass}
          >
            <LayoutDashboard size={19} />

            Dashboard
          </NavLink>

          {/* Orders */}

          <NavLink
            to="/admin/orders"
            className={navLinkClass}
          >
            <ShoppingCart size={19} />

            Orders
          </NavLink>

          {/* Products */}

          <NavLink
            to="/admin/products"
            className={navLinkClass}
          >
            <Package size={19} />

            Products
          </NavLink>

          {/* Users */}

          <NavLink
            to="/admin/users"
            className={navLinkClass}
          >
            <Users size={19} />

            Customers
          </NavLink>

          {/* ================= MANAGEMENT ================= */}

          <div className="pt-6">

            <p className="px-4 mb-2 text-xs uppercase tracking-wider text-gray-500">
              Management
            </p>

            <NavLink
              to="/admin/settings"
              className={navLinkClass}
            >
              <Settings size={19} />

              Settings
            </NavLink>

          </div>

        </nav>

        {/* ================= ADMIN PROFILE ================= */}

        <div className="p-4 border-t border-white/10">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">

            {/* Admin Avatar */}

            <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center font-bold">
              {adminInitial}
            </div>

            {/* Admin Details */}

            <div className="flex-1 min-w-0">

              <p className="font-medium truncate">
                {admin?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {admin?.email || "admin@test.com"}
              </p>

            </div>

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      {/* ================= MAIN CONTENT ================= */}

      <main className="min-h-screen min-w-0 flex-1 lg:ml-64">

        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-ml-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Open admin menu"
            aria-controls="admin-sidebar"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={22} />
          </button>
          <span className="ml-2 font-semibold text-gray-900">AdminPanel</span>
        </header>

        <Outlet />

      </main>

    </div>
  );
}

export default AdminLayout;