"use client";

import Editor from "@monaco-editor/react";
import {
  useCodeStore,
  useCurrentCode,
  useCurrentSlug,
  useLangStore,
} from "@/lib/store/codeStore";
import { useTheme } from "next-themes";
import { registerLiteCodeMonacoThemes } from "@/lib/monaco-theme";

const EditorPane = () => {
  const currentCode = useCurrentCode();
  const currentSlug = useCurrentSlug();
  const language = useLangStore((state) => state.lang);
  const { resolvedTheme } = useTheme();

  const setCodeForSlug = useCodeStore((state) => state.setCodeForSlug);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          beforeMount={registerLiteCodeMonacoThemes}
          theme={resolvedTheme === "dark" ? "litecode-dark" : "litecode-light"}
          value={currentCode}
          onChange={(value) => {
            if (!currentSlug || value === undefined) {
              return;
            }

            setCodeForSlug(currentSlug, value);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </section>
  );
};

export default EditorPane;
