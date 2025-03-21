"use client";
import { Loader2, Loader2Icon, PlayIcon, RocketIcon } from "lucide-react";
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
import { useState } from "react";
import { useNavBarStore, useTab } from "@/lib/store/uiStore";
import Link from "next/link";

const NavBar = () => {
  const c = useCodeStore((state) => state.c);
  const { lang, setLang } = useLangStore();
  const { testCaseStatus, setTestCaseStatus } = useTestCaseStore();
  const slug = useSlugStore((state) => state.slug);
  const { tab, setTab } = useTab();
  const { show, setShow } = useNavBarStore();

  const runCode = async () => {
    setIsRunning(true);
    const res = await axios.post(`${BACKEND_URL}/v1/run`, {
      slug: slug,
      code: c,
      language: lang,
    });

    const data = res.data.result;
    setTestCaseStatus(data);
    setIsRunning(false);
  };

  const submitCode = async () => {
    setIsSubmitting(true);

    const res = await axios.post(`${BACKEND_URL}/v1/submit`, {
      slug: slug,
      code: c,
      language: lang,
    });

    const submissionToken = res.data.submissionId;

    const response = await axios.get(
      `${BACKEND_URL}/v1/getsubmissionstatus?submissionId=${submissionToken}`
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
  };

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex justify-between bg-black text-white p-2">
      {/* Logo  */}
      {show ? (
        <Link href="/problem">
          <div className="text-center font-bold text-3xl text-purple-400">
            LiteCode
          </div>
        </Link>
      ) : (
        <Link href="/">
          <div className="text-center font-bold text-3xl text-purple-400">
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
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">Javascript</SelectItem>
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
              <Button className="bg-emerald-500" onClick={submitCode}>
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
        <Button className="bg-purple-600">Pro</Button>
        <Button className="bg-blue-400">Signup</Button>
      </div>
    </div>
  );
};

export default NavBar;
