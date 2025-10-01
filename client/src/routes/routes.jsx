import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

export const PublicRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include"
        });
        if (res.ok) setAuth(true);
        else setAuth(false);
      } catch {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return !auth ? <Outlet /> : <Navigate to="/home" />;
};

export const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include"
        });
        if (res.ok) setAuth(true);
        else setAuth(false);
      } catch {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};
