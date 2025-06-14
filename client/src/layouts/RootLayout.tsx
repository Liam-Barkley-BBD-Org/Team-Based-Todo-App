import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { tokenManager } from '../api/tokenManager';
import { AppLoader } from '../components/app-loader';

export interface RefreshResponse {
  token: string;
}

export function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const attemptSilentRefresh = async () => {
      try {
        const { data } = await axios.post<RefreshResponse>('http://localhost:3000/api/auth/refresh');
        tokenManager.setToken(data.token);
      } catch (err) {
        {/*  */}
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