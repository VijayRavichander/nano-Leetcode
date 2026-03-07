interface MonacoThemeApi {
  editor: {
    defineTheme: (
      name: string,
      theme: {
        base: "vs" | "vs-dark";
        inherit: boolean;
        rules: Array<{ token: string; foreground: string; fontStyle?: string }>;
        colors: Record<string, string>;
      },
    ) => void;
  };
}

export const registerLiteCodeMonacoThemes = (monaco: MonacoThemeApi) => {
  monaco.editor.defineTheme("litecode-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a867d" },
      { token: "keyword", foreground: "5f72de" },
      { token: "string", foreground: "7a8f52" },
      { token: "number", foreground: "9f4f45" },
      { token: "type", foreground: "476a50" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#171717",
      "editorLineNumber.foreground": "#a39d92",
      "editorLineNumber.activeForeground": "#5f5952",
      "editorCursor.foreground": "#5f72de",
      "editor.selectionBackground": "#e2e7ff",
      "editor.lineHighlightBackground": "#f6f2eb",
      "editorGutter.background": "#ffffff",
      "editorIndentGuide.background1": "#ece7dd",
      "editorIndentGuide.activeBackground1": "#ddd8cf",
    },
  });

  monaco.editor.defineTheme("litecode-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a867d" },
      { token: "keyword", foreground: "9aaeff" },
      { token: "string", foreground: "a7d2b0" },
      { token: "number", foreground: "e0a39b" },
      { token: "type", foreground: "d7c07b" },
    ],
    colors: {
      "editor.background": "#14171a",
      "editor.foreground": "#f3efe6",
      "editorLineNumber.foreground": "#6c6a63",
      "editorLineNumber.activeForeground": "#a39d92",
      "editorCursor.foreground": "#9aaeff",
      "editor.selectionBackground": "#2b3557",
      "editor.lineHighlightBackground": "#1b2128",
      "editorGutter.background": "#14171a",
      "editorIndentGuide.background1": "#23282d",
      "editorIndentGuide.activeBackground1": "#2b2f33",
    },
  });

  monaco.editor.defineTheme("litecode-stealth", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "F5F5F5" },
      { token: "comment", foreground: "6B7280" },
      { token: "keyword", foreground: "FF4D57" },
      { token: "keyword.control", foreground: "FF4D57" },
      { token: "operator", foreground: "FF4D57" },
      { token: "string", foreground: "F3C6D8" },
      { token: "number", foreground: "F3C6D8" },
      { token: "constant", foreground: "F3C6D8" },
      { token: "function", foreground: "7EC8FF" },
      { token: "function.call", foreground: "7EC8FF" },
      { token: "type", foreground: "7EC8FF" },
      { token: "type.identifier", foreground: "7EC8FF" },
      { token: "class", foreground: "7EC8FF" },
      { token: "variable", foreground: "F5F5F5" },
      { token: "identifier", foreground: "F5F5F5" },
      { token: "delimiter", foreground: "F5F5F5" },
      { token: "invalid", foreground: "FF4D57" },
      { token: "invalid.illegal", foreground: "FF4D57" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#F5F5F5",
      "editorLineNumber.foreground": "#F5F5F580",
      "editorLineNumber.activeForeground": "#F5F5F5",
      "editorCursor.foreground": "#7EC8FF",
      "editor.selectionBackground": "#0E0E0EB3",
      "editor.selectionHighlightBackground": "#1414147A",
      "editor.lineHighlightBackground": "#050505",
      "editorGutter.background": "#000000",
      "editorIndentGuide.background1": "#0B0B0B",
      "editorIndentGuide.activeBackground1": "#121212",
      "editor.border": "#242424",
      "editorGroup.border": "#242424",
      "editorWidget.border": "#242424",
      "editorError.foreground": "#FF4D57",
      "editorError.border": "#FF4D5700",
      "editorWhitespace.foreground": "#F5F5F533",
    },
  });
};
