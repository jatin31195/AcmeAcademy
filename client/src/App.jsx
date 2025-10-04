import { Routes, Route, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ProtectedRoute, PublicRoute } from "./routes/Routes";
import Navbar from "./components/layout/Navbar";
import About from "./pages/About";
import Footer from "./components/layout/Footer";
import PYQ from "./pages/PYQ";
import PdfReader from "./pages/PDFReader";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
         
        </Route>
         <Route path="/pyq" element={<PYQ />} />
  <Route path="/pyq/:id" element={<PdfReader />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About/>}/>
        </Route>

        {/* Default/fallback */}
        <Route path="*" element={<Signup />} />
      </Routes>
      {!hideNavbar&&<Footer/>}
    </>
  );
}

export default App;
