import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const API_BASE = `${BASE_URL}/api/users`;
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/profile`, {
        withCredentials: true,
      });
      const userData = res.data?.data?.user || {};

     
      if (!userData.profilePic && userData.fullname) {
        userData.initials = userData.fullname
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
      }

      setUser(userData);
      setError("");
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      setUser(null);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
