import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FullPageLoading } from '../components/ui/FullPageLoading';
import { isSupabaseConfigured } from '../lib/supabase';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // No Supabase configured yet — skip the auth gate so the app can be browsed locally.
  if (!isSupabaseConfigured) return <Outlet />;

  if (loading) return <FullPageLoading />;
  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
}
