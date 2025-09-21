import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.role = token.role as any;
        session.email = token.email as any;
        session.user.name = token.name as any;
        session.accessToken = token.accessToken as any;
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
