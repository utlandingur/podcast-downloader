import NextAuth from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { User, UserDocument } from "@/models/user";
import Google from "next-auth/providers/google";

export async function getUser(email: string): Promise<UserDocument | null> {
  try {
    await connectToDatabase();
    const user: UserDocument | null = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log("Error fetching user", error);
    return null;
  }
}

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
    async signIn({ user }) {
      console.log("User signed in", user);
      return true;
    },
  },
});
