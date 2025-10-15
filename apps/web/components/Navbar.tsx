"use client";
import { Loader2, LockIcon, PlayIcon, RocketIcon } from "lucide-react";
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
import {
  useCodeStore,
  useLangStore,
  useSlugStore,
  useTestCaseStore,
} from "@/lib/store/codeStore";
import { useState } from "react";
import { useNavBarStore, useTab, useRunButtonState } from "@/lib/store/uiStore";
import Link from "next/link";
import NavbarActionDropDown from "./ActionDropDown";

import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const NavBar = () => {


  const codeInEditor = useCodeStore((state) => state.getCurrentCode());
  const { lang: selectedLanguage, setLang: setSelectedLanguage } = useLangStore();
  const setTestStatus = useTestCaseStore((state) => state.setTestCaseStatus);
  const problemSlug = useSlugStore((state) => state.slug);
  const { tab: activeTab, setTab: setActiveTab } = useTab();
  const { show: showControls } = useNavBarStore();
  const { isRunning, setIsRunning } = useRunButtonState();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = authClient.useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    router.push("/signin");
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      const res = await axios.post(`/api/run`, {
        slug: problemSlug,
        userCode: codeInEditor,
        language: selectedLanguage,
      });

      const data = res.data.result;

      if (problemSlug) {
        setTestStatus(problemSlug, data);
      }
      setIsRunning(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          await handleSignIn();

          setIsRunning(false);
        } else {
          console.error("Error:", error);

          setIsRunning(false);
        }
      } else {
        setIsRunning(false);
      }
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);

    try {
      const res1 = await axios.post(`/api/run`, {
        slug: problemSlug,
        userCode: codeInEditor,
        language: selectedLanguage,
      });

      const data = res1.data.result;

      const res = await axios.post(`/api/submit`, {
        slug: problemSlug,
        userCode: codeInEditor,
        language: selectedLanguage,
      });

      const submissionToken = res.data.submissionId;
      console.log(submissionToken);

      const response = await axios.get(
        `/api/submissionstatus?submissionId=${submissionToken}`
      );

      if (problemSlug) {
        setTestStatus(problemSlug, data);
      }

      if (response.data.status == "ACCEPTED") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#60A5FA", "#34D399", "#818CF8"],
        });
      }
      setActiveTab("submissions");
      setIsSubmitting(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 401) {
          await handleSignIn();
          setIsSubmitting(false);
        } else {
          console.error("Error:", error);
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className={`flex px-4 justify-between bg-black text-white p-2 ${showControls ? "" : "border-b border-violet-400"}`}
    >
      {/* Logo  */}
      <Link href={showControls ? "/problem" : "/"}>
        <div
          className={`text-center lowercase font-bold text-2xl md:text-3xl  text-purple-400 tracking-tighter`}
        >
          LiteCode
        </div>
      </Link>

      {/* Buttons */}
      <div className={`${showControls ? "" : "hidden"}`}>
        <div>
          <div className="flex justify-between gap-2">
            <div>
              <Select
                onValueChange={(value) => setSelectedLanguage(value)}
                defaultValue="cpp"
              >
                <SelectTrigger className="w-full md:w-[180px] focus:ring-0! focus:outline-none! border-0! shadow-none text-white bg-neutral-900">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className=" text-white/90! bg-neutral-800">
                  <SelectItem value="cpp" className="">
                    CPP
                  </SelectItem>
                  <SelectItem value="python" className="" disabled>
                    <LockIcon className="w-4 h-4" /> Python
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                className=" text-blue-400 active:scale-95 transition-all duration-200 cursor-pointer font-normal hover:bg-blue-500/50 hover:text-blue-200"
                onClick={runCode}
              >
                <AnimatePresence mode="wait">
                  {isRunning ? (
                    <motion.div
                      key="running"
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        bounce: 0.3,
                      }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="run"
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        bounce: 0.3,
                      }}
                      className="flex items-center gap-2 text-sm md:text-base"
                    >
                      <PlayIcon className="hidden md:block fill-current" />
                      Run
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            <div>
              <Button
                className="group text-green-600 active:scale-95 transition-all duration-200 cursor-pointer font-normal hover:bg-emerald-500/50 hover:text-green-200"
                onClick={submitCode}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        bounce: 0.3,
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="submit"
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        bounce: 0.3,
                      }}
                      className="flex items-center gap-2 text-sm md:text-base"
                    >
                      <RocketIcon className="hidden md:block" />
                      Submit
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Premium & Signup */}
      <div className="flex justify-between gap-2">
        {!session.data ? (
          <Button
            className=" lowercase hover:underline
                        bg-neutral-950
                        text-white/90 hover:text-white hover:bg-neutral-800
                        text-sm
                        px-2 rounded-md
                        active:scale-95 transition-all duration-300
                        cursor-pointer focus:outline-none
          "
            onClick={handleSignIn}
          >
            Sign in
          </Button>
        ) : (
          <NavbarActionDropDown session={session} />
        )}
      </div>
    </div>
  );
};

export default NavBar;
