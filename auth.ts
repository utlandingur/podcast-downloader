import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const isDev = process.env.NODE_ENV === "development";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    ...(isDev
      ? [
          Credentials({
            name: "DevLogin",
            credentials: {},
            async authorize() {
              return {
                id: "local-dev-user",
                name: "Dev User",
                email: "dev@local.test",
              };
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    // maxAge: is 30 days by default
  },
  callbacks: {
    async session({ session, token }) {
      // Inject user ID into session if available
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
});
