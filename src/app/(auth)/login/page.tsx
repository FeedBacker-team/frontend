import type { Metadata } from 'next';

import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { LoginForm } from '@/components/domain/auth/LoginForm';

export const metadata: Metadata = {
  title: '로그인',
};

export default function LoginPage() {
  return (
    <AuthLayout size="login">
      <LoginForm />
    </AuthLayout>
  );
}
