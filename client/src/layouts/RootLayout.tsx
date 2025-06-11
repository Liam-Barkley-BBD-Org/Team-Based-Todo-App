import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { tokenManager } from '../api/tokenManager';
import { AppLoader } from '../components/app-loader';
// import AppLoader from '../components/AppLoader'; // Assumed to exist

export function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const attemptSilentRefresh = async () => {
      try {
        const csrfResponse = await axios.get('/api/auth/csrf-token');
        const refreshResponse = await axios.post('/api/auth/refresh', {}, {
          headers: { 'X-CSRF-TOKEN': csrfResponse.data.csrfToken }
        });
        tokenManager.setToken(refreshResponse.data.jwt);
      } catch (err) {
        console.log("No active session to refresh.");
      } finally {
        setIsInitializing(false);
      }
    };
    attemptSilentRefresh();
  }, []);

  if (isInitializing) {
    return <AppLoader message="Loading..." />;
  }

  return <Outlet />;
}