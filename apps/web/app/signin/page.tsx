"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Google } from "@lobehub/icons";

export default function Signin() {
  const handleSignin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/problem",
        errorCallbackURL: "/auth/login/error",
      });
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="app-theme app-page flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)] shadow-[var(--app-shadow)]">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CardTitle>Welcome to Litecode</CardTitle>
          <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
            Sign in to keep your progress, submissions, and practice history in sync.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Button
            onClick={handleSignin}
            className="app-text-action cursor-pointer px-0 py-0 shadow-none"
          >
            Continue with Google <Google.Color className="h-4 w-4" />
          </Button>
        </CardContent>
        <CardFooter className="text-center text-xs font-normal leading-5 text-[var(--app-muted)]">
          By Signing in, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}
