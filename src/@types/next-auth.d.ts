import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
    accessToken: string;
    email: string;
    name: string;
  }

  interface Session {
    role: "USER" | "ADMIN";
    accessToken: string;
    email: string;
    user: {
      name?: string | null;
    } & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN";
    accessToken: string;
    email: string;
    name?: string | null;
  }
}
