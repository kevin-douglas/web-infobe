'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/Typography/Heading';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Step {
  title: string;
  hidden?: boolean;
  routes: {
    title: string;
    icon: string;
    path: string;
    hidden?: boolean;
    sub_paths?: string[];
  }[];
}

interface DashboardLayoutProps {
  list: Step[];
  children: React.ReactNode;
  onLogout?: () => void;
}

function SidebarList({
  list,
  collapsed,
  onItemClick,
}: {
  list: Step[];
  collapsed: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-8 text-black-0',
        collapsed ? 'px-1' : 'px-0',
      )}
    >
      {!collapsed && (
        <Heading type="H1" className="mx-0 pt-12 text-center text-[32px]">
          InfoBe
        </Heading>
      )}

      {list
        .filter((s) => !s.hidden)
        .map((s) => (
          <div key={s.title} className="flex flex-col">
            {s.routes
              .filter((r) => !r.hidden)
              .map((r) => {
                const isActive =
                  pathname === r.path ||
                  (r.sub_paths && r.sub_paths.includes(pathname));

                const linkEl = (
                  <Link
                    key={r.title}
                    href={r.path}
                    onClick={onItemClick}
                    className={cn(
                      'group mx-3 my-1 rounded-[8px] px-6 py-3 transition-colors focus:outline-none',
                      collapsed && 'mx-2 px-0 py-2',
                      (isActive
                        ? 'border-[1px] border-primary-100 bg-primary-100/12'
                        : 'hover:bg-white/5') +
                        ' focus:border-[1px] focus:border-primary-100 focus:bg-primary-100/12',
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-3',
                        collapsed && 'justify-center',
                      )}
                    >
                      <Icon
                        icon={r.icon}
                        className={cn(
                          'h-6 w-6',
                          isActive ? 'text-text-primary' : 'text-black-0',
                        )}
                      />
                      {!collapsed && <Heading type="H2">{r.title}</Heading>}
                    </div>
                  </Link>
                );

                return collapsed ? (
                  <Tooltip key={r.title}>
                    <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {r.title}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkEl
                );
              })}
          </div>
        ))}
    </div>
  );
}

function MobileBottomBar({
  list,
  onLogout,
}: {
  list: Step[];
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  const routes = list
    .flatMap((s) => s.routes)
    .filter((r) => !r.hidden)
    .slice(0, 3);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#2E2E2E] pt-3 pb-[calc(env(safe-area-inset-bottom)+8px)]"
      style={{ boxShadow: '0 -6px 24px rgba(0,0,0,0.25)' }}
    >
      <ul className="flex items-center justify-center">
        {routes.map((r) => {
          const isActive =
            pathname === r.path ||
            (r.sub_paths && r.sub_paths.includes(pathname));
          return (
            <li key={r.title}>
              <Link
                href={r.path}
                className={cn(
                  'flex h-[56px] w-[70px] items-center justify-center rounded-xl transition-colors',
                  isActive
                    ? 'border border-primary-100 bg-primary-100/20'
                    : 'hover:bg-white/5',
                )}
                title={r.title}
              >
                <Icon icon={r.icon} className="h-6 w-6 text-white" />
              </Link>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={onLogout}
            className="flex h-[56px] w-[70px] items-center justify-center rounded-xl transition-colors hover:bg-white/5"
            aria-label="Sair"
            title="Sair"
          >
            <Icon icon="tabler:logout" className="h-6 w-6 text-white" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  list,
  children,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const saved =
      typeof window !== 'undefined'
        ? localStorage.getItem('sidebar:collapsed')
        : null;
    if (saved) setCollapsed(saved === '1');
  }, []);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar:collapsed', collapsed ? '1' : '0');
    }
  }, [collapsed]);

  return (
    <>
      <section className="relative min-h-dvh w-screen overflow-hidden max-[904px]:block min-[905px]:hidden">
        <div className="flex min-h-[calc(100dvh-56px)] w-full flex-col gap-10 overflow-y-auto bg-gray-50 px-6 py-6 pb-24">
          {children}
        </div>
        <MobileBottomBar list={list} onLogout={onLogout} />
      </section>

      <section
        className="h-dvh w-full flex-row max-[904px]:hidden min-[905px]:flex"
        style={{
          background: 'linear-gradient(90deg, #2E2E2E 0%, #3D3D3D 89.06%)',
        }}
      >
        <aside
          className={cn(
            'relative flex h-full flex-col gap-10 border-r border-blue-50 transition-[width] duration-300 ease-in-out',
            collapsed ? 'w-[72px]' : 'w-[360px]',
          )}
        >
          <SidebarList
            list={list}
            collapsed={collapsed}
            onItemClick={() => {}}
          />

          <div
            className={cn(
              'mt-auto flex items-center gap-4 border-t border-t-primary-200 p-3 text-black-0',
              collapsed && 'justify-center',
            )}
          >
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                    aria-label="Sair"
                    title="Sair"
                  >
                    <Icon
                      icon="tabler:logout"
                      className="h-6 w-6 text-black-0"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Sair
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="flex cursor-pointer items-center gap-4 px-6 py-2"
              >
                <Icon icon="tabler:logout" className="h-6 w-6 text-black-0" />
                {!collapsed && <Heading type="H2">Sair</Heading>}
              </button>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? 'Expandir menu' : 'Encolher menu'}
                className="absolute top-1/2 right-[-16px] z-10 -translate-y-1/2 cursor-pointer"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#2E2E2E] shadow-md transition-transform duration-300 hover:scale-105">
                  <Icon
                    icon={
                      collapsed
                        ? 'tabler:layout-sidebar-left-expand'
                        : 'tabler:layout-sidebar-left-collapse'
                    }
                    className="h-5 w-5 text-white"
                  />
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              {collapsed ? 'Expandir menu' : 'Encolher menu'}
            </TooltipContent>
          </Tooltip>
        </aside>

        <div className="flex h-full w-full flex-1 flex-col items-start gap-10 overflow-y-auto bg-gray-50 p-8">
          {children}
        </div>
      </section>
    </>
  );
};
