import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
    accessToken: string;
    email: string;
  }

  interface Session {
    role: "USER" | "ADMIN";
    accessToken: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN";
    accessToken: string;
    email: string;
  }
}
