import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTeamPage from './pages/create-team.tsx';
import Dashboard from './pages/dashboard.tsx';
import CreateTaskPage from './pages/create-task.tsx';
import TaskDetailPage from './pages/task-details.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import TwoFactorPage from './pages/TwoFactorPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import ProtectedRoute from './components/protected-route.tsx';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/create-team",
    element: (
      <ProtectedRoute userId={sessionStorage.getItem('UserID') as string} requiredRole="Team Leader">
        <CreateTeamPage userId={sessionStorage.getItem('UserID') as string} />
      </ProtectedRoute>
    ),
  },
  { path: "/create-task", element: <CreateTaskPage /> },
  { path: "/task-details", element: <TaskDetailPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/reset-password", element: <ForgotPasswordPage /> },
  { path: "/2fa", element: <TwoFactorPage /> },
  { path: "/admin-roles", element: <AdminPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
