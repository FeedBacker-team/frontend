import { RequireAuth } from '@/components/domain/auth/RequireAuth';

export default function MyPageLayout({ children }: LayoutProps<'/mypage'>) {
  return <RequireAuth>{children}</RequireAuth>;
}
