'use client';

import { DashboardLayout } from '@/components/Layouts/dashboard.layout';
import { PATHS_ROUTE } from '@/app/constants/paths-route.constants';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    router.push('/login');
  };

  return (
    <DashboardLayout
      list={[
        {
          title: 'Painel',
          routes: [
            {
              icon: 'tabler:home',
              title: 'Início',
              path: PATHS_ROUTE.DASHBOARD.HOME,
              exact: true,
            },
            {
              icon: 'hugeicons:course',
              title: 'Cursos',
              path: PATHS_ROUTE.DASHBOARD.COURSES.HOME,
            },
            {
              icon: 'tabler:certificate',
              title: 'Certificados',
              path: PATHS_ROUTE.DASHBOARD.CERTIFICATE.HOME,
            },
          ],
        },
      ]}
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
}
