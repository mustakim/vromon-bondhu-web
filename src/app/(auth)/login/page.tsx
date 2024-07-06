"use client";
import React from 'react';
import { useRouter } from 'next/navigation'
import Login from '../../../components/Login';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <div>
      <Login onLogin={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
