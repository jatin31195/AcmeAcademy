import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users/me";

export const PublicRoute = () => {
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    const checkAuth = async () => {
      try {
        const res = await fetch(API_URL, { credentials: "include" });
        if (!ignore) setAuth(res.ok);
      } catch {
        if (!ignore) setAuth(false);
      }
    };

    checkAuth();
    return () => { ignore = true; };
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return !auth ? <Outlet /> : <Navigate to="/home" replace state={{ from: location }} />;
};

export const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    const checkAuth = async () => {
      try {
        const res = await fetch(API_URL, { credentials: "include" });
        if (!ignore) setAuth(res.ok);
      } catch {
        if (!ignore) setAuth(false);
      }
    };

    checkAuth();
    return () => { ignore = true; };
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return auth ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};
