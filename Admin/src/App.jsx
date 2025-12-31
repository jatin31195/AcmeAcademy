import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Login from "@/pages/Login";
import Dashboard from "./pages/Dashboard";
import PYQsPage from "./pages/PYQsPage";
import UsersPage from "./pages/UsersPage";
import HomeCoursesPage from "./pages/HomeCoursesPage";
import SelfStudyCoursesPage from "./pages/SelfStudyCoursesPage";
import SelfStudySubjectPage from "./pages/SelfStudySubjectPage";
import SelfStudySubjectTopicPage from "./pages/SelfStudySubjectTopicPage";
import SelfStudyTopicTestPage from "./pages/SelfStudyTopicTestPage";
import SelfStudyTestQuestionPage from "./pages/SelfStudyTestQuestionPage";
import YearlyResultPage from "./pages/YearlyResultPage";
import PracticeSetPage from "./pages/PracticeSetPage";
import PracticeCategoryPage from "./pages/PracticeCategoryPage";
import PracticeQuestionPage from "./pages/PracticeQuestionPage";
import HomeResultImagesPage from "./pages/HomeResultImagesPage";
import HomeNoticePage from "./pages/HomeNoticePage";
import AdminSendMailPage from "./pages/AdminSendMailPage";

function App() {
  return (
    <>
      {/* Global Toast */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
      />

      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Placeholder routes – add pages later */}
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="home-courses" element={<HomeCoursesPage />} />
            <Route
  path="/admin/home-images"
  element={<HomeResultImagesPage />}
/>
<Route
  path="/admin/home-notices"
  element={<HomeNoticePage />}
/>
             <Route path="courses" element={< SelfStudyCoursesPage/>} />
             <Route
  path="/admin/self-study-courses/:courseId/subjects"
  element={<SelfStudySubjectPage />}
/>
            <Route
  path="/admin/self-study-courses/:courseId/subjects/:subjectId/topics"
  element={<SelfStudySubjectTopicPage />}
/>
<Route
          path="/admin/self-study-courses/:courseId/subjects/:subjectId/topics/:topicId/tests"
          element={<SelfStudyTopicTestPage/>}
        />
            <Route
            path="/admin/self-study/tests/:testId/questions"
            element={<SelfStudyTestQuestionPage/>}
            />
            
             <Route path="results" element={<YearlyResultPage />} />
             <Route path="results/:exam" element={<YearlyResultPage />} />

            <Route path="pyqs" element={<PYQsPage/>} />
            <Route path="practice-sets" element={< PracticeSetPage/>} />
            <Route
              path="/admin/practice-set/:practiceSetId/categories"
              element={<PracticeCategoryPage />}
            />
            <Route
              path="/admin/practice-category/:practiceTopicId/questions"
              element={<PracticeQuestionPage />}
            />

        
            <Route path="mails" element={<AdminSendMailPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
