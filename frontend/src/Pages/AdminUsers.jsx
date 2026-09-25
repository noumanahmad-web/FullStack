import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH USERS =================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/users"
      );

      const data = await response.json();

      console.log("USERS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("USERS ERROR:", error);

      setError(
        error.message || "Something went wrong while fetching users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH =================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value)
    );
  });

  // ================= STATS =================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status !== "inactive"
  ).length;

  // New users = users created in last 30 days
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  const newUsers = users.filter((user) => {
    if (!user.createdAt) return false;

    return new Date(user.createdAt) >= thirtyDaysAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}

      <div className="bg-white border-b border-gray-200">
        <div className="px-6 lg:px-8 py-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Store Management
              </p>

              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                Users
              </h1>

              <p className="text-gray-500 mt-1">
                View and manage registered customers.
              </p>
            </div>

            {/* ================= TOTAL USERS ================= */}

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Total Users
                  </p>

                  <p className="text-xl font-bold text-gray-900">
                    {totalUsers}
                  </p>
                </div>

              </div>

              {/* Refresh */}

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                title="Refresh users"
              >
                <RefreshCw
                  size={19}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-6 lg:p-8">

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">

            <p className="font-semibold">
              Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>

          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

          {/* Total Users */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {totalUsers}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users
                  size={21}
                  className="text-blue-600"
                />
              </div>

            </div>

          </div>

          {/* Active Users */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Active Users
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {activeUsers}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <UserCheck
                  size={21}
                  className="text-green-600"
                />
              </div>

            </div>

          </div>

          {/* New Users */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  New Users
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {newUsers}
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Last 30 days
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                <UserPlus
                  size={21}
                  className="text-purple-600"
                />
              </div>

            </div>

          </div>

        </div>

        {/* ================= USERS TABLE ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Table Header */}

          <div className="p-6 border-b border-gray-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  All Users
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Registered customers will appear here.
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full md:w-72">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search users..."
                  className="w-full bg-gray-100 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />

              </div>

            </div>

          </div>

          {/* ================= LOADING ================= */}

          {loading ? (

            <div className="py-20 text-center">

              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="text-gray-500 mt-4">
                Loading users...
              </p>

            </div>

          ) : filteredUsers.length === 0 ? (

            /* ================= EMPTY ================= */

            <div className="py-20 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">

                <Users
                  size={28}
                  className="text-gray-400"
                />

              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-5">
                {search
                  ? "No users found"
                  : "No users yet"}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                {search
                  ? "Try a different search."
                  : "Registered users will appear here."}
              </p>

            </div>

          ) : (

            /* ================= TABLE ================= */

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-gray-50 border-b border-gray-200">

                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* User */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-900">
                              {user.name || "Unknown"}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID: {user._id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                          {user.role || "user"}
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Active
                        </span>

                      </td>

                      {/* Joined */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-PK",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>

                      {/* Action */}

                      <td className="px-6 py-4 text-right">

                        <button
                          onClick={() =>
                            console.log(
                              "VIEW USER:",
                              user
                            )
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-blue-600 transition"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;