const API_BASE_URL = "http://localhost:5000/api";

export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  const makeRequest = async (accessToken) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
    });
  };

  // First request
  let response = await makeRequest(token);

  // Access token expired
  if (response.status === 401) {
    const refreshResponse = await fetch(
      `${API_BASE_URL}/users/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const refreshData = await refreshResponse.json();

    if (refreshResponse.ok && refreshData.success) {
      // Save new access token
      localStorage.setItem("token", refreshData.token);

      // Retry original request
      response = await makeRequest(refreshData.token);
    } else {
      // Refresh token also expired/invalid
      localStorage.removeItem("token");
    }
  }

  return response;
};