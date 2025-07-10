
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Tests from "./pages/admin/Tests";
import CreateTest from "./pages/admin/CreateTest";
import EditTest from "./pages/admin/EditTest";
import EditTestWizard from "./components/admin/EditTestWizard";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyTests from "./pages/student/MyTests";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import TestTakingPage from "./pages/student/test/TestTaking";
import TestResults from "./pages/student/TestResults";
import TestReview from "./pages/student/test/TestReview";
import MultiModuleReview from "./pages/student/test/MultiModuleReview";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }>
                <Route index element={<StudentDashboard />} />
                <Route path="browse" element={<MyTests />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>

              {/* Test Taking Routes */}
              <Route path="/student/test/:testId" element={
                <ProtectedRoute requiredRole="student">
                  <TestTakingPage />
                </ProtectedRoute>
              } />
              <Route path="/student/test/:testId/results" element={
                <ProtectedRoute requiredRole="student">
                  <TestResults />
                </ProtectedRoute>
              } />
              <Route path="/student/test/:testId/review" element={
                <ProtectedRoute requiredRole="student">
                  <TestReview />
                </ProtectedRoute>
              } />
              {/* Fallback route for test results without testId */}
              <Route path="/student/test/results" element={
                <ProtectedRoute requiredRole="student">
                  <TestResults />
                </ProtectedRoute>
              } />
              {/* Fallback route for test review without testId */}
              <Route path="/student/test/review" element={
                <ProtectedRoute requiredRole="student">
                  <TestReview />
                </ProtectedRoute>
               } />
               {/* Multi-module test review route */}
               <Route path="/student/test/:testId/multi-module-review" element={
                 <ProtectedRoute requiredRole="student">
                   <MultiModuleReview />
                 </ProtectedRoute>
               } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="tests" element={<Tests />} />
                <Route path="create-test" element={<CreateTest />} />
                <Route path="edit-test/:testId" element={<EditTest />} />
                <Route path="edit-test-wizard/:testId" element={<EditTestWizard />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
