import { signIn } from "../../auth";

export async function googleAuthenticate() {
  try {
    // Redirects the user to the Google sign-in page
    await signIn("google");
  } catch (error) {
    console.error("Google login failed:", error);
    return "Google login failed";
  }
}
