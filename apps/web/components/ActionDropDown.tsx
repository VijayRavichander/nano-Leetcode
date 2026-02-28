import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NavbarSession {
  data?:
    | {
        user?: {
          name?: string | null;
          email?: string | null;
        };
      }
    | null;
}

const NavbarActionDropDown = ({
  session,
  variant = "default",
}: {
  session: NavbarSession;
  variant?: "default" | "landing" | "app";
}) => {
  const router = useRouter();
  const isLanding = variant === "landing";
  const isApp = variant === "app";
  const displayName = session.data?.user?.name || session.data?.user?.email || "User";
  const initials = displayName
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          isLanding
            ? "cursor-pointer text-sm font-medium tracking-[0.08em] text-[var(--landing-link)] transition-colors hover:text-[var(--landing-accent-blue-strong)] focus:outline-none"
            : isApp
              ? "cursor-pointer text-sm font-medium tracking-[0.08em] text-[var(--app-text)] transition-colors hover:text-[var(--app-accent)] focus:outline-none"
            : `
          cursor-pointer rounded-md
          bg-neutral-950 px-2 text-xs! text-white/90
          transition-all hover:bg-linear-to-b hover:text-white
          to-neutral-900 from-neutral-800
          focus:outline-none
          data-[state=open]:scale-[1.01]
        `
        }
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          isLanding
            ? "w-44 border border-[var(--landing-border)] bg-[var(--landing-surface)] p-1 text-sm text-[var(--landing-text)] shadow-[var(--landing-shadow-strong)]"
            : isApp
              ? "w-44 border border-[var(--app-border)] bg-[var(--app-panel)] p-1 text-sm text-[var(--app-text)] shadow-[var(--app-shadow-strong)]"
            : "cursor-pointer border border-white/10 bg-neutral-900 font-sm text-white/90"
        }
      >
        <DropdownMenuItem
          className={
            isLanding
              ? "text-[var(--landing-text)] focus:bg-transparent focus:text-[var(--landing-accent-blue-strong)]"
              : isApp
                ? "text-[var(--app-text)] focus:bg-transparent focus:text-[var(--app-accent)]"
              : "hover:bg-white/90!"
          }
          onClick={() => router.push("/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className={
            isLanding
              ? "text-[var(--landing-text)] focus:bg-transparent focus:text-[var(--landing-accent-blue-strong)]"
              : isApp
                ? "text-[var(--app-text)] focus:bg-transparent focus:text-[var(--app-accent)]"
              : "hover:bg-white/90!"
          }
          onClick={handleSignOut}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarActionDropDown;
