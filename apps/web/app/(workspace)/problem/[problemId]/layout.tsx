import NavBar from "@/components/Navbar";

export default function ProblemWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-theme flex h-dvh min-h-dvh flex-col bg-[var(--app-panel)] text-[var(--app-text)]">
      <NavBar workspace />
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[var(--app-panel)]">
        {children}
      </div>
    </div>
  );
}
