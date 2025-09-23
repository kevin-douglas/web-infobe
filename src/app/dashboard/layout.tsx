'use client';

import { DashboardLayout } from '@/components/Layouts/dashboard.layout';
import { PATHS_ROUTE } from '@/app/constants/paths-route.constants';
import { signOut } from 'next-auth/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true,
    });
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
