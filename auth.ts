import { getUser } from "@/serverActions/userActions";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
    // maxAge: is 30 days by default
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  callbacks: {
    async session({ session }) {
      const user = await getUser(session.user.email);
      //add user to session
      if (!user) {
        return session;
      }

      session.user = user.toObject();

      return session;
    },
    async signIn() {
      return true;
    },
  },
});
