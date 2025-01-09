"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function GoogleSignInButton() {
  return (
    <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
      Sign In with Google
    </Button>
  );
}
