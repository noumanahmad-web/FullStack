import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

function AuthModal({
  isLogin,
  setIsLogin,
  setShowAuth,
  message,

  registerData,
  handleRegisterChange,
  handleRegister,

  loginData,
  handleLoginChange,
  handleLogin,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">

        {/* Close */}
        <button
          onClick={() => setShowAuth(false)}
          className="absolute right-5 top-4 text-gray-500 text-2xl hover:text-black"
        >
          ×
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-center text-gray-500 mt-2">
          {isLogin
            ? "Login to your account"
            : "Create your new account"}
        </p>

        {/* Forms */}

        {!isLogin && (
          <RegisterForm
            registerData={registerData}
            handleRegisterChange={handleRegisterChange}
            handleRegister={handleRegister}
          />
        )}

        {isLogin && (
          <LoginForm
            loginData={loginData}
            handleLoginChange={handleLoginChange}
            handleLogin={handleLogin}
          />
        )}

        {/* Message */}

        {message && (
          <p className="text-center mt-4 text-green-600 font-medium">
            {message}
          </p>
        )}

        {/* Switch */}

        <div className="text-center mt-6 text-gray-600">

          {isLogin ? (
            <>
              Don't have an account?{" "}

              <button
                onClick={() => {
                  setIsLogin(false);
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}

              <button
                onClick={() => {
                  setIsLogin(true);
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default AuthModal;