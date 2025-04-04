import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      axios
        .get("https://localhost:7166/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data); // Lưu toàn bộ thông tin user (id, username, email, role)
        })
        .catch(() => {
          setToken("");
          setUser(null);
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post("https://localhost:7166/api/auth/login", {
        username,
        password,
      });
      const { token } = res.data;
      setToken(token);
      localStorage.setItem("token", token);

      // Gọi API để lấy thông tin user ngay sau khi đăng nhập
      const userRes = await axios.get("https://localhost:7166/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
