import { JWT } from 'next-auth/jwt';

export type MiddlewareRule = {
  match: (path: string) => boolean;
  redirect: (session: JWT | null) => string | null;
};

export const rules: MiddlewareRule[] = [
  // Redireciona a raiz para /login quando não autenticado
  // ou para /home quando já autenticado
  {
    match: (path) => path === '/',
    redirect: (session) => (session ? '/dashboard' : '/login'),
  },
  // Impede usuários autenticados de acessarem a página de login
  {
    match: (path) => path === '/login' || path === '/entrar',
    redirect: (session) => (session ? '/dashboard' : null),
  },
  // Protege a rota /home para apenas usuários autenticados
  {
    match: (path) => path === '/dashboard' || path.startsWith('/dashboard/'),
    redirect: (session) => (session ? null : '/login'),
  },
];
