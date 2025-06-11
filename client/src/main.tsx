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
import LoginPage from './pages/LoginPage.tsx';
import { ProtectedRoute } from './layouts/ProtectedRoute.tsx';


const queryClient = new QueryClient({ /* ... your default options ... */ });

const router = createBrowserRouter([
  {
    // The RootLayout is the parent of ALL routes.
    // It handles the initial loading and session check.
    element: <RootLayout />,
    children: [
      {
        // Public routes are direct children of the RootLayout
        path: '/login',
        element: <LoginPage />,
      },
      {
        // The ProtectedRoute layout acts as a gatekeeper for all nested routes.
        element: <ProtectedRoute />,
        children: [
          // All routes inside here require authentication.
          {
            path: '/', // Redirect root to dashboard
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
            path: '/task-details/:taskId', // Use path params for dynamic routes
            element: <TaskDetailPage />,
          },
          {
            path: '/team-details/:teamId', // Use path params
            element: <TeamView />,
          },
        ],
      },
      // You can add other top-level routes here, like a 404 page
      // { path: '*', element: <NotFoundPage /> }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The QueryClientProvider should wrap the RouterProvider */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);