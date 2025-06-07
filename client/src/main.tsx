import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTeamPage from './pages/create-team.tsx';
import Dashboard from './pages/dashboard.tsx';
import CreateTaskPage from './pages/create-task.tsx';
import TaskDetailPage from './pages/task-details.tsx';

const router = createBrowserRouter([
  {
    path: '/', element: <App />,
  },
  {
    path: '/dashboard', element: <Dashboard />
  },
  {
    path: '/create-team', element: <CreateTeamPage/>
  },
  {
    path: '/create-task',
    element: <CreateTaskPage/>
  },
  {
    path: '/task-details',
    element: <TaskDetailPage/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
