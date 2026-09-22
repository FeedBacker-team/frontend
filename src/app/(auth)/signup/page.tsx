import type { Metadata } from 'next';

import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { SignupForm } from '@/components/domain/auth/SignupForm';

export const metadata: Metadata = {
  title: '회원가입',
};

export default function SignupPage() {
  return (
    <AuthLayout size="signup">
      <SignupForm />
    </AuthLayout>
  );
}
