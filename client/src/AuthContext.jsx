import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
   
      const res = await fetch("http://localhost:5000/api/users/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return;
      }

  
      if (res.status === 401) {
        console.warn("Access token expired — trying refresh...");
        const refreshRes = await fetch("http://localhost:5000/api/users/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          console.log("Access token refreshed successfully ✅");
          const { user: refreshedUser } = await refreshRes.json();
          setUser(refreshedUser);
          return;
        } else {
          console.warn("Refresh token invalid or expired ❌");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);

  
  const login = (userData) => setUser(userData);


  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
