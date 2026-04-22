import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "http://localhost:8085/rideon",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;

    },
    (error) => Promise.reject(error)
)

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default AxiosInstance;