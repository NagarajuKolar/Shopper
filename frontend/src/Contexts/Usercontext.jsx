import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import API from "../utils/api";
const Authusercontext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setIsLoggedIn(false);

      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          `${API}/api/user/checkauthentication`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          setUser(null);
          setIsLoggedIn(false);
          return;
        }

        const data = await res.json();

        setUser({
          userId: data.userId,
          role: data.role,
          name:data.name
        });
        setIsLoggedIn(true);
      }
      catch (error) {
        setUser(null);
        setIsLoggedIn(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <Authusercontext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn,handleLogout }}>
      {children}
    </Authusercontext.Provider>
  );
};

export const userAuth = () => useContext(Authusercontext);

