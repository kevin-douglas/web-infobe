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
    HOME: '/home',
    USERS: {
      HOME: '/dashboard/usuarios',
      PROFILE: '/dashboard/usuarios/perfil',
    },
  },
} as const;
