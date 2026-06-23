const API_ROOT_URL = "http://localhost:3000";
const API_BASE_URL = `${API_ROOT_URL}/api`;

function buildApiUrl(endpoint) {
  if (endpoint.startsWith("http")) return endpoint;
  if (endpoint.startsWith("/api")) return `${API_ROOT_URL}${endpoint}`;
  if (endpoint.startsWith("/auth") || endpoint.startsWith("/test")) {
    return `${API_ROOT_URL}${endpoint}`;
  }
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("palestra_token");
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && !(config.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    config.body =
      typeof config.body === "string" ? config.body : JSON.stringify(config.body);
  }

  const response = await fetch(buildApiUrl(endpoint), config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || "Erro na requisição";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: "GET" });
}

function post(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: "POST", body });
}

function put(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: "PUT", body });
}

function del(endpoint, options = {}) {
  return request(endpoint, { ...options, method: "DELETE" });
}

window.PalestraAPI = {
  API_BASE_URL,
  get,
  post,
  put,
  del,
};
