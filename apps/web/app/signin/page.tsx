"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Google } from '@lobehub/icons';

export default function Signin() {
  const router = useRouter();

  const handleSignin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
        errorCallbackURL: "/auth/login/error",  
      });

    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <Card className="bg-neutral-950 text-white border-none">
        <CardHeader className="flex flex-col justify-center items-center">
          <CardTitle>Welcome to Litecode</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <Button onClick={handleSignin} className = "bg-neutral-900 hover:bg-linear-to-b to-neutral-800 from-neutral-700 cursor-pointer active:scale-95 transition-all duration-300">Continue with Google <Google.Color className="w-4 h-4" /> </Button>
        </CardContent>
        <CardFooter className="text-xs font-light text-white/50">
          By Signing in, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}
