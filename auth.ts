import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
    // maxAge: is 30 days by default
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn() {
      return true;
    },
  },
});
