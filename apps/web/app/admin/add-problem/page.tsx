"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PlusIcon, Trash2Icon, XIcon, Sparkles, Loader2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { registerLiteCodeMonacoThemes } from "@/lib/monaco-theme";

type CodeAndLanguage = {
  language: string;
  code: string;
};

type SimpleTestCase = { input: string; output: string };

type DescriptionTestCase = {
  input: string;
  output: string;
  explanation: string;
};

type ProblemForm = {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "None" | "Contest" | "Non_Contest";
  tags: string[];
  description: string;
  editorial: string;
  constraints: string[];
  testCases: DescriptionTestCase[];
  visibleTestCases: SimpleTestCase[];
  hiddenTestCases: SimpleTestCase[];
  functionCode: CodeAndLanguage[];
  completeCode: CodeAndLanguage[];
};

const defaultForm: ProblemForm = {
  title: "",
  slug: "",
  difficulty: "Easy",
  type: "None",
  tags: [],
  description: "",
  editorial: "",
  constraints: [""],
  testCases: [
    {
      input: "",
      output: "",
      explanation: "",
    },
  ],
  visibleTestCases: [{ input: "", output: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
  functionCode: [{ language: "cpp", code: "" }],
  completeCode: [{ language: "cpp", code: "" }],
};

export default function AddProblemPage() {
  const [form, setForm] = useState<ProblemForm>(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const [examples, setExamples] = useState("");
  const [problemHint, setProblemHint] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { resolvedTheme } = useTheme();

  const slugFromTitle = useMemo(() => {
    if (!form.title.trim()) return "";
    return form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }, [form.title]);

  const handleBasicChange = (key: keyof ProblemForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (form.tags.includes(t)) {
      toast("Tag already added");
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));
  };

  const updateArrayItem = <T extends any[]>(
    key: keyof ProblemForm,
    index: number,
    value: any
  ) => {
    setForm((prev) => {
      const list = [...(prev[key] as T)];
      const current = list[index] as any;
      const next = typeof current === "object" && current !== null && typeof value === "object" && value !== null
        ? { ...current, ...(value as any) }
        : (value as any);
      list[index] = next as T[number];
      return { ...prev, [key]: list } as ProblemForm;
    });
  };

  const addArrayItem = (key: keyof ProblemForm, emptyItem: any) => {
    setForm((prev) => ({ ...prev, [key]: [ ...(prev[key] as any[]), emptyItem ] }));
  };

  const removeArrayItem = (key: keyof ProblemForm, index: number) => {
    setForm((prev) => {
      const list = [...(prev[key] as any[])];
      list.splice(index, 1);
      return { ...prev, [key]: list } as ProblemForm;
    });
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!form.title.trim()) errors.push("Title is required");
    if (!form.slug.trim()) errors.push("Slug is required");
    if (!form.description.trim()) errors.push("Description is required");
    if (!form.editorial.trim()) errors.push("Editorial is required");
    const firstFn = form.functionCode?.[0];
    if (!firstFn || !firstFn.code || !firstFn.code.trim())
      errors.push("At least one boilerplate code snippet is required");
    return errors;
  };

  const handleGenerateWithAI = async () => {
    if (!examples.trim()) {
      toast.error("Please provide example problems for few-shot prompting");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/admin/generate-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examples: examples.trim(),
          problemHint: problemHint.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setForm(data.problem);
        toast.success("Problem generated successfully!");
      } else {
        toast.error("Failed to generate problem", {
          description: data.error || "An unknown error occurred",
        });
      }
    } catch {
      toast.error("Failed to generate problem", {
        description: "Network error or server unavailable",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (errs.length) {
      toast.error("Please fix the following:", { description: errs.join("\n") });
      return;
    }

    const payload: ProblemForm = {
      ...form,
      slug: form.slug || slugFromTitle,
    };


    const response = await fetch("/api/admin/add-problem", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success("Problem added successfully");
    } else {
      toast.error("Failed to add problem", {
        description: data.error || "An unknown error occurred",
      });
    }
  };

  return (
    <div className="app-theme app-page">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Toaster position="top-right" richColors closeButton />

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="app-section-label">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
              Add problem
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
              Create prompts, examples, test cases, and reference solutions in the same minimal
              system used across the rest of LiteCode.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className={outlineButtonClass} onClick={() => setForm(defaultForm)}>
              Reset
            </Button>
            <Button className={primaryButtonClass} onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>

      {/* AI Generation Section */}
      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-[var(--app-accent)]" />
            Generate with AI
          </CardTitle>
          <CardDescription>
            Use example problems as context and let the model draft the full form.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Example Problems (Required for few-shot prompting)
            </label>
            <textarea
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              rows={8}
              placeholder="Paste 1-3 example problems here in any format (LeetCode problems, contest problems, etc.). The AI will learn from these examples to generate a similar problem."
              className={textareaClass}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Problem Hint/Topic (Optional)
            </label>
            <input
              value={problemHint}
              onChange={(e) => setProblemHint(e.target.value)}
              placeholder="e.g., 'binary search', 'dynamic programming', 'graph traversal'"
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleGenerateWithAI}
              disabled={isGenerating || !examples.trim()}
              className={primaryButtonClass}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate Problem
                </>
              )}
            </Button>
            {isGenerating && (
              <div className="flex items-center text-sm text-[var(--app-muted)]">
                This may take 10 to 30 seconds.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle>Basics</CardTitle>
          <CardDescription>Title, slug, difficulty, type, and tags</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => handleBasicChange("title", e.target.value)}
                placeholder="Two Sum"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <input
                value={form.slug || slugFromTitle}
                onChange={(e) => handleBasicChange("slug", e.target.value)}
                placeholder="two-sum"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={form.difficulty}
                onValueChange={(v: any) => handleBasicChange("difficulty", v)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={form.type}
                onValueChange={(v: any) => handleBasicChange("type", v)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Contest">Contest</SelectItem>
                  <SelectItem value="Non_Contest">Non_Contest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="array, hash-map, two-pointers"
                className={inputClass}
              />
              <Button type="button" onClick={addTag} className={primaryButtonClass}>
                <PlusIcon className="size-4" />
                Add
              </Button>
            </div>
            {!!form.tags.length && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="app-chip cursor-pointer rounded-full transition-colors hover:border-[var(--app-muted)] hover:bg-[var(--app-panel)] hover:text-[var(--app-text)]"
                    onClick={() => removeTag(t)}
                    title="Remove tag"
                  >
                    {t}
                    <XIcon className="size-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle>Description & Constraints</CardTitle>
          <CardDescription>Write a clear problem statement and its constraints</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleBasicChange("description", e.target.value)}
              rows={8}
              placeholder="Describe the problem, input/output format, and requirements."
              className={textareaClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Editorial (Markdown)</label>
            <textarea
              value={form.editorial}
              onChange={(e) => handleBasicChange("editorial", e.target.value)}
              rows={12}
              placeholder={"## Intuition\nExplain the key insight.\n\n## Approach\nDescribe the algorithm step by step.\n\n## Complexity\n- Time: O(...)\n- Space: O(...)"}
              className={textareaClass}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Constraints</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={outlineButtonClass}
                onClick={() => addArrayItem("constraints", "")}
              >
                <PlusIcon className="size-4" /> Add constraint
              </Button>
            </div>
            <div className="space-y-3">
              {form.constraints.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={c}
                    onChange={(e) => updateArrayItem<any[]>("constraints", i, e.target.value)}
                    placeholder="1 <= n <= 1e5"
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={outlineIconButtonClass}
                    onClick={() => removeArrayItem("constraints", i)}
                    aria-label="Remove constraint"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle>Examples</CardTitle>
          <CardDescription>Sample test cases for the problem description</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {form.testCases.map((tc, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-panel-muted)] p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input</label>
                  <textarea
                    value={tc.input}
                    onChange={(e) => updateArrayItem<DescriptionTestCase[]>("testCases", i, { input: e.target.value })}
                    rows={3}
                    className={textareaClass}
                    placeholder="2\n1 2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Output</label>
                  <textarea
                    value={tc.output}
                    onChange={(e) => updateArrayItem<DescriptionTestCase[]>("testCases", i, { output: e.target.value })}
                    rows={3}
                    className={textareaClass}
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Explanation</label>
                <textarea
                  value={tc.explanation}
                  onChange={(e) => updateArrayItem<DescriptionTestCase[]>("testCases", i, { explanation: e.target.value })}
                  rows={3}
                  className={textareaClass}
                  placeholder="Explain how the result is obtained."
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={outlineButtonClass}
                  onClick={() => removeArrayItem("testCases", i)}
                >
                  <Trash2Icon className="size-4" /> Remove example
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className={outlineButtonClass}
            onClick={() => addArrayItem("testCases", { input: "", output: "", explanation: "" })}
          >
            <PlusIcon className="size-4" /> Add example
          </Button>
        </CardContent>
      </Card>

      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>Visible and hidden test cases used for evaluation</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="visible">
            <TabsList className="bg-[var(--app-panel-muted)]">
              <TabsTrigger value="visible">Visible</TabsTrigger>
              <TabsTrigger value="hidden">Hidden</TabsTrigger>
            </TabsList>
            <TabsContent value="visible" className="space-y-4 pt-4">
              {form.visibleTestCases.map((tc, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    value={tc.input}
                    onChange={(e) => updateArrayItem<SimpleTestCase[]>("visibleTestCases", i, { input: e.target.value })}
                    rows={3}
                    className={textareaClass}
                    placeholder="Input"
                  />
                  <div className="flex gap-2">
                    <textarea
                      value={tc.output}
                      onChange={(e) => updateArrayItem<SimpleTestCase[]>("visibleTestCases", i, { output: e.target.value })}
                      rows={3}
                      className={textareaClass}
                      placeholder="Expected Output"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={outlineIconButtonClass}
                      onClick={() => removeArrayItem("visibleTestCases", i)}
                      aria-label="Remove visible test case"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className={outlineButtonClass}
                onClick={() => addArrayItem("visibleTestCases", { input: "", output: "" })}
              >
                <PlusIcon className="size-4" /> Add visible test
              </Button>
            </TabsContent>
            <TabsContent value="hidden" className="space-y-4 pt-4">
              {form.hiddenTestCases.map((tc, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    value={tc.input}
                    onChange={(e) => updateArrayItem<SimpleTestCase[]>("hiddenTestCases", i, { input: e.target.value })}
                    rows={3}
                    className={textareaClass}
                    placeholder="Input"
                  />
                  <div className="flex gap-2">
                    <textarea
                      value={tc.output}
                      onChange={(e) => updateArrayItem<SimpleTestCase[]>("hiddenTestCases", i, { output: e.target.value })}
                      rows={3}
                      className={textareaClass}
                      placeholder="Expected Output"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={outlineIconButtonClass}
                      onClick={() => removeArrayItem("hiddenTestCases", i)}
                      aria-label="Remove hidden test case"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className={outlineButtonClass}
                onClick={() => addArrayItem("hiddenTestCases", { input: "", output: "" })}
              >
                <PlusIcon className="size-4" /> Add hidden test
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle>Boilerplate Code</CardTitle>
          <CardDescription>Language-specific starter code for the editor</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {form.functionCode.map((fc, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Language</span>
                  <Select
                    value={fc.language}
                    onValueChange={(v) => updateArrayItem<CodeAndLanguage[]>("functionCode", i, { language: v })}
                  >
                    <SelectTrigger className={selectTriggerSmallClass}>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="cpp">C++</SelectItem>
                      {/* Extend as you add languages */}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={outlineButtonClass}
                  onClick={() => removeArrayItem("functionCode", i)}
                >
                  <Trash2Icon className="size-4" /> Remove
                </Button>
              </div>
              <div className="overflow-hidden rounded-md border border-[var(--app-border)]">
                <Editor
                  height="220px"
                  beforeMount={registerLiteCodeMonacoThemes}
                  theme={resolvedTheme === "dark" ? "litecode-dark" : "litecode-light"}
                  defaultLanguage={fc.language}
                  value={fc.code}
                  onChange={(val) => updateArrayItem<CodeAndLanguage[]>("functionCode", i, { code: val || "" })}
                  options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className={outlineButtonClass}
            onClick={() => addArrayItem("functionCode", { language: "cpp", code: "" })}
          >
            <PlusIcon className="size-4" /> Add language
          </Button>
        </CardContent>
      </Card>

      <Card className="border-[var(--app-border)] bg-[var(--app-panel)] shadow-[var(--app-shadow)]">
        <CardHeader className="border-b border-[var(--app-border)]">
          <CardTitle>Complete Code</CardTitle>
          <CardDescription>Reference solution(s) for internal use</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {form.completeCode.map((fc, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Language</span>
                  <Select
                    value={fc.language}
                    onValueChange={(v) => updateArrayItem<CodeAndLanguage[]>("completeCode", i, { language: v })}
                  >
                    <SelectTrigger className={selectTriggerSmallClass}>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={outlineButtonClass}
                  onClick={() => removeArrayItem("completeCode", i)}
                >
                  <Trash2Icon className="size-4" /> Remove
                </Button>
              </div>
              <div className="overflow-hidden rounded-md border border-[var(--app-border)]">
                <Editor
                  height="220px"
                  beforeMount={registerLiteCodeMonacoThemes}
                  theme={resolvedTheme === "dark" ? "litecode-dark" : "litecode-light"}
                  defaultLanguage={fc.language}
                  value={fc.code}
                  onChange={(val) => updateArrayItem<CodeAndLanguage[]>("completeCode", i, { code: val || "" })}
                  options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className={outlineButtonClass}
            onClick={() => addArrayItem("completeCode", { language: "cpp", code: "" })}
          >
            <PlusIcon className="size-4" /> Add language
          </Button>
        </CardContent>
        <CardFooter className="mt-6 flex justify-end border-t border-[var(--app-border)] pt-6">
          <Button className={primaryButtonClass} onClick={handleSubmit}>
            Save
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}

const inputClass = cn(
  "w-full rounded-md border border-[var(--app-border)] bg-[var(--app-panel)] px-3 py-2 text-sm text-[var(--app-text)] shadow-none outline-none placeholder:text-[var(--app-muted)] focus-visible:border-[var(--app-accent)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklab,var(--app-accent)_30%,transparent)]"
);

const textareaClass = cn(
  "min-h-24 w-full rounded-md border border-[var(--app-border)] bg-[var(--app-panel)] px-3 py-2 text-sm text-[var(--app-text)] shadow-none outline-none placeholder:text-[var(--app-muted)] focus-visible:border-[var(--app-accent)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklab,var(--app-accent)_30%,transparent)]"
);

const selectTriggerClass = cn(
  "w-full border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)] shadow-none focus-visible:border-[var(--app-accent)] focus-visible:ring-[color-mix(in_oklab,var(--app-accent)_30%,transparent)]"
);

const selectTriggerSmallClass = cn(
  "w-40 border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)] shadow-none focus-visible:border-[var(--app-accent)] focus-visible:ring-[color-mix(in_oklab,var(--app-accent)_30%,transparent)]"
);

const selectContentClass = cn(
  "border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)] shadow-[var(--app-shadow)]"
);

const primaryButtonClass = cn(
  "app-text-action cursor-pointer px-0 py-0 shadow-none"
);

const outlineButtonClass = cn(
  "app-text-action app-text-action-muted cursor-pointer px-0 py-0 shadow-none"
);

const outlineIconButtonClass = cn(
  "app-text-action app-text-action-muted shrink-0 cursor-pointer px-0 py-0 shadow-none"
);
