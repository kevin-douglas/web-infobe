import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { AuthService } from "@/@core/auth/service/auth.service";
import { uuidv4 } from "zod";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data } = await AuthService.postLogin({
            email: credentials.email,
            password: credentials.password,
          });

          const id = uuidv4();
          return {
            id: String(id),
            role: data.role,
            email: credentials.email,
            accessToken: data.accessToken,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.role = token.role;
        session.email = token.email;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    newUser: "/sign-up",
    error: "/404",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 2, // 2 dias = 172800 segundos
    updateAge: 60 * 60 * 3, // 3 horas = 10800 segundos
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
