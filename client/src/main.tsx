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


const queryClient = new QueryClient({ });

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
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
        ],
      },

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