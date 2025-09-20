import { JWT } from "next-auth/jwt";

export type MiddlewareRule = {
  match: (path: string) => boolean;
  redirect: (session: JWT | null) => string | null;
};

export const rules: MiddlewareRule[] = [
  {
    match: (path) => path.startsWith("/dashboard"),
    redirect: (session) => (session ? null : "/login"),
  },
];
