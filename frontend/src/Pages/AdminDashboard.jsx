import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Eye,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  // =========================
  // STATES
  // =========================

  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0,
    lowStock: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        setError("Admin authentication required.");
        return;
      }

      // =========================
      // API REQUESTS
      // =========================

      const [productsResponse, ordersResponse, usersResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/products"),

          fetch("http://localhost:5000/api/orders/admin/all", {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }),

          fetch("http://localhost:5000/api/users"),
        ]);

      // =========================
      // CHECK RESPONSES
      // =========================

      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products");
      }

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders");
      }

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      // =========================
      // CONVERT TO JSON
      // =========================

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      const usersData = await usersResponse.json();

      // =========================
      // DATA
      // =========================

      const products = productsData.products || [];
      const orders = ordersData.orders || [];
      const users = usersData.users || [];

      // =========================
      // LOW STOCK
      // =========================

      const lowStockProducts = products.filter(
        (product) => Number(product.stock) <= 5
      );

      // =========================
      // REVENUE
      // Cancelled orders excluded
      // =========================

      const totalRevenue = orders
        .filter((order) => order.status !== "cancelled")
        .reduce((total, order) => {
          return total + Number(order.total || 0);
        }, 0);

      // =========================
      // SORT ORDERS
      // Latest first
      // =========================

      const sortedOrders = [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.date) -
            new Date(a.createdAt || a.date)
        )
        .slice(0, 5);

      // =========================
      // SET STATS
      // =========================

      setStats({
        orders: orders.length,
        products: products.length,
        users: users.length,
        revenue: totalRevenue,
        lowStock: lowStockProducts.length,
      });

      setRecentOrders(sortedOrders);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "shipped":
        return "bg-indigo-100 text-indigo-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] p-5 sm:p-8">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-950 rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="hidden lg:flex w-64 bg-gray-950 text-white flex-col fixed left-0 top-0 bottom-0">

        {/* Logo */}

        <div className="h-20 flex items-center px-6 border-b border-white/10">

          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-gray-950 font-black text-lg">
              A
            </span>
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

        {/* Navigation */}

        <nav className="flex-1 px-4 py-6 space-y-2">

          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-950 font-medium"
          >
            <TrendingUp size={19} />
            Dashboard
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <ShoppingCart size={19} />
            Orders
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <Package size={19} />
            Products
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <Users size={19} />
            Customers
          </Link>

          <div className="pt-6">

            <p className="px-4 mb-2 text-xs uppercase tracking-wider text-gray-500">
              Management
            </p>

            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition"
            >
              <Settings size={19} />
              Settings
            </Link>

          </div>

        </nav>

        {/* Admin Profile */}

        <div className="p-4 border-t border-white/10">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">

            <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center font-bold">
              A
            </div>

            <div className="flex-1 min-w-0">

              <p className="font-medium truncate">
                Admin
              </p>

              <p className="text-xs text-gray-400 truncate">
                Admin Panel
              </p>

            </div>

            <button className="text-gray-400 hover:text-white">
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex-1 ">

        {/* Top Header */}

        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-5 sm:px-8">

          <div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500 hidden sm:block">
              Welcome back, Admin 👋
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={fetchDashboardData}
              className="hidden sm:block px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              Refresh
            </button>

            <Link
              to="/admin/products"
              className="hidden sm:flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              <Plus size={17} />
              Add Product
            </Link>

            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
              A
            </div>

          </div>

        </header>

        {/* Content */}

        <div className="p-5 sm:p-8">

          {/* ERROR */}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* ORDERS */}

            <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Total Orders
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.orders}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                  <ShoppingCart size={21} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4 text-sm">

                <TrendingUp size={15} />

                <span className="font-medium">
                  Live
                </span>

                <span className="text-gray-400">
                  from database
                </span>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Total Products
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.products}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Package size={21} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4 text-sm text-gray-500">

                <span className="font-medium text-gray-900">
                  {stats.lowStock}
                </span>

                low stock items

              </div>

            </div>

            {/* CUSTOMERS */}

            <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Customers
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.users}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Users size={21} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4 text-sm">

                <ArrowUpRight size={15} />

                <span className="font-medium">
                  Live
                </span>

                <span className="text-gray-400">
                  from database
                </span>

              </div>

            </div>

            {/* REVENUE */}

            <div className="bg-gray-950 text-white rounded-2xl p-5 hover:shadow-lg transition">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    Total Revenue
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {formatCurrency(stats.revenue)}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <DollarSign size={21} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4 text-sm text-gray-300">

                <TrendingUp size={15} />

                <span>
                  Cancelled orders excluded
                </span>

              </div>

            </div>

          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <div className="mt-8">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Quick Actions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your store quickly
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <Link
                to="/admin/orders"
                className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-lg transition"
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-900 transition"
                  />

                </div>

                <h3 className="font-bold text-gray-900 mt-5">
                  Manage Orders
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View and update customer orders.
                </p>

              </Link>

              <Link
                to="/admin/products"
                className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-lg transition"
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Package size={20} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-900 transition"
                  />

                </div>

                <h3 className="font-bold text-gray-900 mt-5">
                  Manage Products
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Add, edit and manage products.
                </p>

              </Link>

              <Link
                to="/admin/users"
                className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-lg transition"
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Users size={20} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-900 transition"
                  />

                </div>

                <h3 className="font-bold text-gray-900 mt-5">
                  Manage Customers
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View registered customers.
                </p>

              </Link>

            </div>

          </div>

          {/* ================= RECENT ORDERS ================= */}

          <div className="mt-8 bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-200">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest orders from your customers
                </p>

              </div>

              <Link
                to="/admin/orders"
                className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:underline"
              >
                View all
                <ArrowUpRight size={15} />
              </Link>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="bg-gray-50">

                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500">

                    <th className="px-6 py-4 font-medium">
                      Order
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Date
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Total
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {recentOrders.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No orders found.
                      </td>

                    </tr>

                  ) : (

                    recentOrders.map((order) => (

                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-5 font-semibold text-gray-900">

                          #
                          {String(order._id).slice(-8)}

                        </td>

                        <td className="px-6 py-5">

                          <div>

                            <p className="font-medium text-gray-900">
                              {order.user?.name ||
                                order.customer?.name ||
                                "Customer"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {order.user?.email ||
                                order.customer?.email ||
                                "No email"}
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          {formatCurrency(order.total)}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status || "Pending"}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <Link
                            to={`/admin/orders`}
                            className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-900 hover:text-white transition"
                          >
                            <Eye size={17} />
                          </Link>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;