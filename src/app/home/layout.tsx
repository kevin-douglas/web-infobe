import { DashboardLayout } from '@/components/Layouts/dashboard.layout';
import { PATHS_ROUTE } from '@/app/constants/paths-route.constants';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            },
            {
              icon: 'hugeicons:course',
              title: 'Cursos',
              path: PATHS_ROUTE.DASHBOARD.USERS.HOME,
            },
            {
              icon: 'tabler:certificate',
              title: 'Certificados',
              path: PATHS_ROUTE.DASHBOARD.USERS.HOME,
            },
          ],
        },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
