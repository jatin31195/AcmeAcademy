import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
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
import OpenLibrary from "./pages/OpenLibrary";
import LibraryContent from "./pages/LibraryContent";
import AcmePlayer from "./pages/AcmePlayer";
import Test from "./pages/Test";
import TestResult from "./pages/TestResult";
import "katex/dist/katex.min.css";
import FreeCourses from "./pages/FreeCourses";
import PracticeSets from "./pages/PracticeSets";
import QuestionSEOPage from "./pages/QuestionSEOPage";

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/acme-courses" ||
    location.pathname.startsWith("/acme-player") ||
    location.pathname.startsWith("/acme-test") ||
    location.pathname.startsWith("/acme-test-result");

  const hideFooter = hideNavbar || location.pathname === "/acme-practice-sets";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* General routes */}
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/pyq/:id" element={<PdfReader />} />
        <Route path="/exam-pattern" element={<ExamPattern />} />
        <Route path="/exams-pattern/nimcet-2025" element={<Nimcet2025 />} />
        <Route path="/acme-courses" element={<Courses />} />
        <Route path="/contact-acme-academy" element={<Contact />} />
        <Route path="/acme-academy-results" element={<Results />} />
        <Route path="/acme-academy-results/:exam/:year" element={<Results />} />
        <Route path="/acme-academy-results/:year" element={<Results />} /> 
        <Route path="/acme-academy-open-library" element={<OpenLibrary />} />
        <Route path="/acme-academy-open-library/:id" element={<LibraryContent />} />
        <Route path="/acme-player" element={<AcmePlayer />} />
        <Route path="/acme-free-courses" element={<FreeCourses />} />
        <Route path="/acme-practice-sets" element={<PracticeSets />} />
        <Route path="/questions/:slug" element={<QuestionSEOPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/acme-test/:testId" element={<Test />} />
          <Route path="/acme-test-result/:testId" element={<TestResult />} />
        </Route>

        {/* Default / unknown route */}
        <Route
          path="*"
          element={
            loading ? null : user ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
