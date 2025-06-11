import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import CreateTeamPage from './pages/create-team.tsx';
import Dashboard from './pages/dashboard.tsx';
import CreateTaskPage from './pages/create-task.tsx';
import TaskDetailPage from './pages/task-details.tsx';
import TeamView from './pages/team-detail.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './layouts/RootLayout.tsx';
import { AuthProtectedRoute } from './layouts/ProtectedRoute.tsx';


const queryClient = new QueryClient({});
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import TwoFactorPage from './pages/TwoFactorPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import NotFound from './pages/NotFoundPage.tsx';
import AddTeamMemberPage from './pages/AddTeamMember.tsx';

// Simulate the logged-in user's ID for now
const loggedInUserId = "123"; // TODO: Replace with context or auth

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/2fa", element: <TwoFactorPage /> },
      { path: "/admin-roles", element: <AdminPage /> },
      {
        element: <AuthProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/create-team',
            element: <CreateTeamPage />,
          },
          {
            path: '/create-task',
            element: <CreateTaskPage />,
          },
          {
            path: '/task-details/:taskId',
            element: <TaskDetailPage />,
          },
          {
            path: '/team-details/:teamName',
            element: <TeamView />,
          },
          {
            element: <AuthProtectedRoute requiredRole="TEAM_LEAD" />,
            children: [
              {
                path: '/team-details/:teamName/add-member',
                element: <AddTeamMemberPage />,
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFound />
      }

    ],
  },


]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);