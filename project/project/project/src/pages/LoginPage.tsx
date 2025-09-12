import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function LoginPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <Navigate to="/" replace />;
}