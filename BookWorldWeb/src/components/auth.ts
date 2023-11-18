import axios from "axios";


export function getToken(email: string, password: string) {
  return axios.post("/api/auth", {
    email,
    password,
  }).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    setUpAxios();
    return response;
  });
}

export function refreshToken() {
  return axios.post("/api/auth/refresh", {
    refreshToken: localStorage.getItem("refreshToken"),
  }).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    setUpAxios();
    return response;
  });
}

export function setUpAxios() {
  // set default header (Beaer token)
  if (localStorage.getItem("token")){
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }

  // set error handler
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401 && error.response.data.name === "TokenExpired") {
        return refreshToken().then(() => {
          const originalRequest = error.config;

          if (!originalRequest._retry) {
            originalRequest._retry = true;
            originalRequest._retryCount = 1;
          } else {
            originalRequest._retryCount += 1;
          }

          if (originalRequest._retryCount > 3) {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return Promise.reject(error);
          }

          originalRequest.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
          return axios(originalRequest);
        });
      }
    }
  );

  // set error codes
  axios.defaults.validateStatus = (status) => {
    return status < 400;
  };

  // set default base url
  axios.defaults.baseURL = "http://localhost:8000";

  // set default timeout
  axios.defaults.timeout = 30000;

  // set default headers
  axios.defaults.headers.post["Content-Type"] = "application/json";
}

