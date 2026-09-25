function RegisterForm({
  registerData,
  handleRegisterChange,
  handleRegister,
}) {
  return (
    <form
      onSubmit={handleRegister}
      className="mt-6 space-y-4"
    >
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={registerData.name}
        onChange={handleRegisterChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={registerData.email}
        onChange={handleRegisterChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={registerData.password}
        onChange={handleRegisterChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Create Account
      </button>
    </form>
  );
}

export default RegisterForm;