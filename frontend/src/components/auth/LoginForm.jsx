function LoginForm({
  loginData,
  handleLoginChange,
  handleLogin,
}) {
  return (
    <form
      onSubmit={handleLogin}
      className="mt-6 space-y-4"
    >
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={loginData.email}
        onChange={handleLoginChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleLoginChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;