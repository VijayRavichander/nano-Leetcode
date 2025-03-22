"use client";
import {
  Loader2,
  Loader2Icon,
  LockIcon,
  PlayIcon,
  RocketIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import confetti from "canvas-confetti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import {
  useCodeStore,
  useLangStore,
  useSlugStore,
  useTestCaseStore,
} from "@/lib/store/codeStore";
import { useEffect, useState } from "react";
import { useNavBarStore, useTab, useTokenStore } from "@/lib/store/uiStore";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/nextjs";

import { useAuth } from "@clerk/nextjs";

const NavBar = () => {
  const c = useCodeStore((state) => state.c);
  const { lang, setLang } = useLangStore();
  const { testCaseStatus, setTestCaseStatus } = useTestCaseStore();
  const slug = useSlugStore((state) => state.slug);
  const { tab, setTab } = useTab();
  const { show, setShow } = useNavBarStore();
  const { getToken } = useAuth();
  const { tokenStore, setTokenStore } = useTokenStore();
  const { openSignIn } = useClerk();

  useEffect(() => {
    const isAuthenticated = async () => {
      const token = await getToken();
      setTokenStore(token);
    };
    isAuthenticated();
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/v1/run`,
        {
          slug: slug,
          code: c,
          language: lang,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenStore}`,
          },
        }
      );

      const data = res.data.result;
      setTestCaseStatus(data);
      setIsRunning(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          openSignIn(); // Open Clerk sign-in modal
          setIsRunning(false);
        } else {
          console.error("Error:", error);
        }
      }
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/v1/submit`,
        {
          slug: slug,
          code: c,
          language: lang,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenStore}`,
          },
        }
      );

      const submissionToken = res.data.submissionId;

      const response = await axios.get(
        `${BACKEND_URL}/v1/getsubmissionstatus?submissionId=${submissionToken}`,
        {
          headers: {
            Authorization: `Bearer ${tokenStore}`,
          },
        }
      );
      if (response.data.status == "ACCEPTED") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#60A5FA", "#34D399", "#818CF8"],
        });
      }
      setTab("submissions");
      setIsSubmitting(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 401) {
          openSignIn();
          setIsSubmitting(false);
        }
      }
    }
  };

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div
      className={`flex px-4 justify-between bg-black text-white p-2 ${show ? "" : "border-b border-violet-400"}`}
    >
      {/* Logo  */}
      {show ? (
        <Link href="/problem">
          <div className="text-center font-bold text-3xl bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
            LiteCode
          </div>
        </Link>
      ) : (
        <Link href="/">
          <div className="text-center font-bold text-3xl bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
            LiteCode
          </div>
        </Link>
      )}

      {/* Buttons */}
      <div className={`${show ? "" : "hidden"}`}>
        <div>
          <div className="flex justify-between gap-2">
            <div>
              <Select
                onValueChange={(value) => setLang(value)}
                defaultValue="cpp"
              >
                <SelectTrigger className="w-[180px] focus:ring-0 focus:outline-none border-[2px] border-blue-200 shadow-none">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white ">
                  <SelectItem value="cpp">CPP</SelectItem>
                  <SelectItem value="python">
                    <LockIcon /> Python
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className="bg-blue-400" onClick={runCode}>
                {isRunning ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PlayIcon />
                )}
                {isRunning ? "Running..." : "Run"}
              </Button>
            </div>
            <div>
              <Button className="bg-green-600" onClick={submitCode}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RocketIcon />
                )}
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Premium & Signup */}
      <div className="flex justify-between gap-2">
        <Button className="bg-gradient-to-r from-amber-400 to-amber-500 cursor-pointer hover:bg-amber-800">
          Pro
        </Button>
        <SignedOut>
          <Button asChild className="bg-blue-400 cursor-pointer">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default NavBar;
