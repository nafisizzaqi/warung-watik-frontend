import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// 🔐 Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚨 Interceptor untuk menangani error (contohnya token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus data login yang sudah tidak valid
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect ke halaman login
      window.location.href = "/login";
    }

    // Teruskan error biar bisa ditangani di tempat lain juga kalau perlu
    return Promise.reject(error);
  }
);

export default api;
