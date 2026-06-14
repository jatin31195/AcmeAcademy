import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ProtectedRoute } from "./routes/routes";
import Navbar from "./components/layout/Navbar";
import About from "./pages/About";
import Footer from "./components/layout/Footer";
import PYQ from "./pages/PYQ";
import PdfReader from "./pages/PdfReader";
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
import ScoreCheckerPage from "./pages/ScoreCheckerPage";  
import ScoreCheckerFloat from "./components/ScoreCheckerFloat/scorecheckerfloat";
import StudentProfilePage from "./pages/profile";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";

// NIMCET Rank Predictor (merged from standalone project — lazy-loaded so
// firebase is not bundled into the main site). RP_BASE = "/nimcet-rank-predictor".
import RankProtectedRoute from "./features/rank-predictor/ProtectedRoute";
import RankPredictorLayout from "./features/rank-predictor/RankPredictorLayout";
import { RP_BASE } from "./features/rank-predictor/constants.js";
const RPOtpAuthPage = lazy(() => import("./features/rank-predictor/pages/OtpAuthPage"));
const RPFormPage    = lazy(() => import("./features/rank-predictor/pages/FormPage"));
const RPReportPage  = lazy(() => import("./features/rank-predictor/pages/ReportPage"));
const RPAdminPage   = lazy(() => import("./features/rank-predictor/pages/AdminPage"));

const RPLoader = () => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", minHeight:"60vh", color:"#64748b", fontWeight:500 }}>
    <div style={{ width:44, height:44, border:"4px solid #bfdbfe", borderTopColor:"#2563eb",
      borderRadius:"50%", animation:"spin 0.8s linear infinite", marginBottom:16 }} />
    Loading…
  </div>
);

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

  const hideFooter = hideNavbar || location.pathname === "/acme-practice-sets"||  location.pathname === "/score-checker";
  // Hide the float on the checker page itself + test/player pages
  const hideFloat =
    location.pathname === "/score-checker" ||
    location.pathname.startsWith("/acme-player") ||
    location.pathname.startsWith("/acme-test") ||
    location.pathname.startsWith(RP_BASE);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route>
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
        <Route path="/acme-practice-sets/:setId" element={<PracticeSets />} />
        <Route path="/acme-practice-sets/:setId/:categoryId" element={<PracticeSets />} />
        <Route
          path="/acme-practice-sets/:setId/:categoryId/:topicName"
          element={<PracticeSets />}
        />
        <Route path="/questions/:slug" element={<QuestionSEOPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/score-checker" element={<ScoreCheckerPage />} />

        {/* ── NIMCET Rank Predictor ── */}
        <Route
          path={RP_BASE}
          element={
            <Suspense fallback={<RPLoader />}>
              <RankPredictorLayout><RPOtpAuthPage /></RankPredictorLayout>
            </Suspense>
          }
        />
        <Route
          path={`${RP_BASE}/form`}
          element={
            <Suspense fallback={<RPLoader />}>
              <RankProtectedRoute>
                <RankPredictorLayout><RPFormPage /></RankPredictorLayout>
              </RankProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path={`${RP_BASE}/report`}
          element={
            <Suspense fallback={<RPLoader />}>
              <RankProtectedRoute>
                <RankPredictorLayout><RPReportPage /></RankPredictorLayout>
              </RankProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path={`${RP_BASE}/admin`}
          element={
            <Suspense fallback={<RPLoader />}>
              <RankProtectedRoute><RPAdminPage /></RankProtectedRoute>
            </Suspense>
          }
        />

        {/* Protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/acme-test/:testId" element={<Test />} />
          <Route path="/acme-test-result/:testId/:attemptNumber?" element={<TestResult />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {!hideFloat && <ScoreCheckerFloat />}
      {!hideFooter && <Footer />}
    </>
  );
}

export default App;