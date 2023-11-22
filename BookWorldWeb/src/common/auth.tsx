import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


function setLocalStorage(token: string, refreshToken: string, role: string, userId: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify({role, userId}));
}

function cleanLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

function getToken(email: string, password: string) {
  return axios.post("/api/auth", {
    email,
    password,
  }).then((response) => {
    setLocalStorage(response.data.token, response.data.refreshToken, response.data.role, response.data.userId);
    setUpAxios();
    return response;
  });
}

function refreshToken() {
  return axios.post("/api/auth/refresh", {
    refreshToken: localStorage.getItem("refreshToken"),
  }).then((response) => {
    setLocalStorage(response.data.token, response.data.refreshToken, response.data.role, response.data.userId);
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
            cleanLocalStorage();
            window.location.href = "/login";
            return Promise.reject(error);
          }

          originalRequest.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
          return axios(originalRequest);
        })
        .catch((error) => {
          cleanLocalStorage();
          window.location.href = "/login";
          return Promise.reject(error);
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

type User = {
  role: "USER"
  email: string
  userId: string
} | {
  role: "ADMIN"
  email: string
  userId: string
} | {
  role: null
  email: null
  userId: null
}

interface AuthContextProps {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    role: null,
    email: null,
    userId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    if (token && refreshToken && user) {
      const parsedUser = JSON.parse(user);
      setUser({
        role: parsedUser.role,
        email: parsedUser.email,
        userId: parsedUser.userId,
      });
      setUpAxios();
    }
  }, []);

  const logout = () => {
    cleanLocalStorage();
    setUser({
      role: null,
      email: null,
      userId: null,
    });
  };

  const login = async (email: string, password: string) => {
    await getToken(email, password)
    .then((response) => {
      if(response.status !== 200) {
        setUser({
          role: null,
          email: null,
          userId: null,
        });
        throw new Error("Login failed");
      }
  
      if (response.data == null) {
        setUser({
          role: null,
          email: null,
          userId: null,
        });
        throw new Error("Login failed");
      }
  
      setUser({
        role: response.data.role,
        email: email,
        userId: response.data.userId,
      });
      return response;
    })
  };


  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
