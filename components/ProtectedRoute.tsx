
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'pro' | 'individual'; // Optional role requirement
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Simple loading spinner or skeleton while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // 1. Not Authenticated -> Redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authenticated but Wrong Role (e.g. Individual trying to access Pro Dashboard)
  if (requiredRole && user?.type !== requiredRole) {
    // SECURITY EXCEPTION: Bypass check if user just created a store
    // This prevents "Access Denied" if state propagation is slower than navigation
    if (requiredRole === 'pro' && location.state?.from === 'store-created') {
       return <>{children}</>;
    }

    // If a Pro tries to access an 'individual' route, we usually let them pass (a pro is also a user).
    // But if an Individual tries to access a 'pro' route, we block.
    if (requiredRole === 'pro' && user?.type !== 'pro') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
