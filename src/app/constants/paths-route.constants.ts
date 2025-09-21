export const PATHS_ROUTE = {
  DEFAULT: {
    HOME: '/',
    NOT_FOUND: '/404',
  },
  AUTH: {
    LOGIN: '/entrar',
    SIGN_UP: '/cadastro',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    COURSES: {
      HOME: '/dashboard/cursos',
    },
    CERTIFICATE: {
      HOME: '/dashboard/certificados',
    },
  },
} as const;
