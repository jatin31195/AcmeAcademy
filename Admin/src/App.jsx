import { Suspense, lazy } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PYQsPage = lazy(() => import("./pages/PYQsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const HomeCoursesPage = lazy(() => import("./pages/HomeCoursesPage"));
const SelfStudyCoursesPage = lazy(() => import("./pages/SelfStudyCoursesPage"));
const SelfStudySubjectPage = lazy(() => import("./pages/SelfStudySubjectPage"));
const SelfStudySubjectTopicPage = lazy(() => import("./pages/SelfStudySubjectTopicPage"));
const SelfStudyTopicTestPage = lazy(() => import("./pages/SelfStudyTopicTestPage"));
const SelfStudyTestQuestionPage = lazy(() => import("./pages/SelfStudyTestQuestionPage"));
const YearlyResultPage = lazy(() => import("./pages/YearlyResultPage"));
const PracticeSetPage = lazy(() => import("./pages/PracticeSetPage"));
const PracticeCategoryPage = lazy(() => import("./pages/PracticeCategoryPage"));
const PracticeQuestionPage = lazy(() => import("./pages/PracticeQuestionPage"));
const HomeResultImagesPage = lazy(() => import("./pages/HomeResultImagesPage"));
const HomeNoticePage = lazy(() => import("./pages/HomeNoticePage"));
const AdminSendMailPage = lazy(() => import("./pages/AdminSendMailPage"));

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

 
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center text-muted-foreground">
              Loading admin workspace...
            </div>
          }
        >
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
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
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
   
    </>
  );
}

export default App;
