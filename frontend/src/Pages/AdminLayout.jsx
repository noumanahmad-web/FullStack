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
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();

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

      <aside className="hidden lg:flex w-64 bg-gray-950 text-white flex-col fixed left-0 top-0 bottom-0">

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

        </div>

        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 px-4 py-6 space-y-2">

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

      {/* ================= MAIN CONTENT ================= */}

      <main className="ml-64 flex-1 min-h-screen">

        <Outlet />

      </main>

    </div>
  );
}

export default AdminLayout;