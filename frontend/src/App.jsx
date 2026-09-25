import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HeroSection from "./components/HeroSection";
import AuthModal from "./components/auth/AuthModal";

import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";

import Categories from "./components/Categories";
import NewArrivals from "./components/NewArrivals";

import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderSuccess from "./Pages/OrderSuccess";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";

/* =========================
   ADMIN
========================= */
import AdminLogin from "./Pages/AdminLogin";
import AdminProtectedRoute from "./Pages/AdminProtectedRoute";
import AdminLayout from "./Pages/AdminLayout";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";

import { CartProvider } from "./context/CartContext";

function AppContent() {
  const [searchTerm, setSearchTerm] = useState("");

  // Auth Modal
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // Register Data
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Login Data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Current route
  const location = useLocation();

  // Admin pages par normal Navbar/Footer hide honge
  const isAdminPage = location.pathname.startsWith("/admin");

  // =========================
  // REGISTER INPUT
  // =========================

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN INPUT
  // =========================

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Registration successful! 🎉");

        setRegisterData({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          setIsLogin(true);
          setMessage("");
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Register Error:", error);
      setMessage("Registration failed");
    }
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Save access token
        localStorage.setItem("token", data.token);

        // Update navbar immediately
        setIsLoggedIn(true);

        // Success message
        setMessage("Login successful! 🎉");

        // Clear login form
        setLoginData({
          email: "",
          password: "",
        });

        // Close modal
        setTimeout(() => {
          setShowAuth(false);
          setMessage("");
        }, 800);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Login failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("Logout Response:", data);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      // Remove access token
      localStorage.removeItem("token");

      // Update navbar immediately
      setIsLoggedIn(false);

      // Close auth modal
      setShowAuth(false);

      // Clear message
      setMessage("");

      // Go home
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =========================
          NORMAL WEBSITE NAVBAR
      ========================= */}

      {!isAdminPage && (
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isLoggedIn={isLoggedIn}
          onSignupClick={() => {
            setShowAuth(true);
            setIsLogin(false);
            setMessage("");
          }}
          onLogout={handleLogout}
        />
      )}

      {/* =========================
          ROUTES
      ========================= */}

     <Routes>
  {/* HOME */}
  <Route
    path="/"
    element={
      <>
        <HeroSection
          onGetStarted={() => {
            setShowAuth(true);
            setIsLogin(false);
            setMessage("");
          }}
        />

        <Shop searchTerm={searchTerm} />
        <Categories />
        <NewArrivals />
      </>
    }
  />

  {/* SHOP */}
  <Route path="/shop" element={<Shop />} />

  {/* PRODUCT DETAILS */}
  <Route path="/product/:id" element={<ProductDetails />} />

  {/* CART */}
  <Route path="/cart" element={<Cart />} />

  {/* CHECKOUT */}
  <Route path="/checkout" element={<Checkout />} />

  {/* ORDER SUCCESS */}
  <Route path="/order-success" element={<OrderSuccess />} />

  {/* MY ORDERS */}
  <Route path="/orders" element={<Orders />} />

  {/* ORDER DETAILS */}
  <Route path="/orders/:id" element={<OrderDetails />} />

  {/* =========================
      ADMIN LOGIN
  ========================= */}
  <Route path="/admin/login" element={<AdminLogin />} />

  {/* =========================
      PROTECTED ADMIN ROUTES
  ========================= */}
  <Route element={<AdminProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="users" element={<AdminUsers />} />
    </Route>
  </Route>
</Routes>

      {/* =========================
          NORMAL WEBSITE FOOTER
      ========================= */}

      {!isAdminPage && <Footer />}

      {/* =========================
          AUTH MODAL
      ========================= */}

      {showAuth && !isAdminPage && (
        <AuthModal
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setShowAuth={setShowAuth}
          message={message}
          registerData={registerData}
          handleRegisterChange={handleRegisterChange}
          handleRegister={handleRegister}
          loginData={loginData}
          handleLoginChange={handleLoginChange}
          handleLogin={handleLogin}
        />
      )}

    </div>
  );
}

// =========================
// APP
// =========================

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;