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
  RefreshCw,
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
    <div className="min-h-screen min-w-0 bg-[#f6f7fb]">
      {/* ================= MAIN ================= */}

      <main className="min-w-0">

        {/* Top Header */}

        <header className="flex min-h-20 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:px-8">

          <div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500 hidden sm:block">
              Welcome back, Admin 👋
            </p>

          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <button
              onClick={fetchDashboardData}
              aria-label="Refresh dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 p-2.5 text-sm font-medium transition hover:bg-gray-50 sm:px-4"
            >
              <RefreshCw size={17} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/admin/products"
              aria-label="Add product"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 p-2.5 text-sm font-medium text-white transition hover:bg-gray-800 sm:px-4"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">Add Product</span>
            </Link>

            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 sm:flex">
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

                  <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
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

                  <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
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

                  <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
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

                  <h3 className="mt-2 wrap-break-word text-2xl font-bold sm:text-3xl">
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

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-4 sm:p-6">

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

            <div className="space-y-3 p-4 md:hidden">
              {recentOrders.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">No orders found.</p>
              ) : (
                recentOrders.map((order) => (
                  <article key={order._id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">
                          Order #{String(order._id).slice(-8)}
                        </p>
                        <p className="mt-1 wrap-break-word font-semibold text-gray-900">
                          {order.user?.name || order.customer?.name || "Customer"}
                        </p>
                        <p className="wrap-break-word text-xs text-gray-500">
                          {order.user?.email || order.customer?.email || "No email"}
                        </p>
                      </div>
                      <Link
                        to="/admin/orders"
                        aria-label={`View order ${String(order._id).slice(-8)}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-900 hover:text-white"
                      >
                        <Eye size={17} />
                      </Link>
                    </div>

                    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Placed</p>
                        <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="hidden overflow-x-auto md:block">

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