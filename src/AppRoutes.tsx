import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import LessonDetailPage from './pages/LessonDetailPage';
import NewLessonPage from './pages/NewLessonPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import ProfilePage from './pages/ProfilePage';

function AuthGuard({ children }: { children: ReactNode }) {
  const currentInstructor = useAuthStore((s) => s.currentInstructor);
  if (!currentInstructor) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AuthGuard><Navigate to="/calendar" replace /></AuthGuard>} />
      <Route path="/calendar" element={<AuthGuard><CalendarPage /></AuthGuard>} />
      <Route path="/calendar/lesson/:lessonId" element={<AuthGuard><LessonDetailPage /></AuthGuard>} />
      <Route path="/calendar/new" element={<AuthGuard><NewLessonPage /></AuthGuard>} />
      <Route path="/students" element={<AuthGuard><StudentsPage /></AuthGuard>} />
      <Route path="/students/:studentId" element={<AuthGuard><StudentDetailPage /></AuthGuard>} />
      <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
