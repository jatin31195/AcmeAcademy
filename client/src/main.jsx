import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./ScrollToTop";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <CookiesProvider>
        <AuthProvider>
           <UserProvider> 
          <BrowserRouter>
           <ScrollToTop />
            <App />
          </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </CookiesProvider>
    </HelmetProvider>
  </React.StrictMode>
);
