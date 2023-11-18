import axios from "axios";


export function get_token(email: string, password: string) {
  return axios.post("/api/auth", {
    email,
    password,
  }).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
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
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
  // set error codes
  axios.defaults.validateStatus = (status) => {
    return status < 500;
  };

  // set default base url
  axios.defaults.baseURL = "http://localhost:8000";
}

