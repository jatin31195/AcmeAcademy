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
import ExamPattern from "./pages/ExamPattern";
import Nimcet2025 from "./components/ExamPattern/Nimcet2025";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup"||location.pathname === "/acme-courses";

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
   <Route path="/exam-pattern" element={<ExamPattern />} />
   <Route path="/exams-pattern/nimcet-2025" element={<Nimcet2025 />}/>
   <Route path="/acme-courses" element={<Courses/>} />
   <Route path="/contact-acme-academy" element={<Contact/>}/>
    <Route path="/acme-academy-results" element={<Results/>}/>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>

        {/* Default/fallback */}
        <Route path="*" element={<Signup />} />
      </Routes>
      {!hideNavbar&&<Footer/>}
    </>
  );
}

export default App;
