import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { isDevAuthBypassEnabledClient } from "@/lib/auth/client-session";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isDevBypass = isDevAuthBypassEnabledClient();
  const displayName = session.data?.user?.name || session.data?.user?.email || "User";
  const email = session.data?.user?.email || "";
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
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-2 py-1.5 text-sm transition-colors focus:outline-none",
            isLanding
              ? "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-link)] hover:border-[var(--landing-accent-blue-strong)] hover:text-[var(--landing-accent-blue-strong)]"
              : "border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)] hover:border-[var(--app-accent)] hover:text-[var(--app-accent)]",
          )}
          aria-label="Open profile menu"
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
              isLanding
                ? "bg-[var(--landing-chrome-bg)] text-[var(--landing-text)]"
                : "bg-[var(--app-panel-muted)] text-[var(--app-text)]",
            )}
          >
            {initials}
          </span>
          <span className="hidden max-w-28 truncate text-left text-sm font-medium md:block">
            {displayName}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={
          isLanding
            ? "w-60 border border-[var(--landing-border)] bg-[var(--landing-surface)] p-1.5 text-sm text-[var(--landing-text)] shadow-[var(--landing-shadow-strong)]"
            : "w-60 border border-[var(--app-popover-border)] bg-[var(--app-popover-bg)] p-1.5 text-sm text-[var(--app-text)] shadow-[var(--app-popover-shadow)]"
        }
      >
        <DropdownMenuLabel className="px-2 py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-inherit">{displayName}</span>
            {email ? (
              <span className={isLanding ? "text-[var(--landing-muted)]" : "text-[var(--app-muted)]"}>
                {email}
              </span>
            ) : null}
            {isDevBypass ? (
              <span
                className={
                  isLanding
                    ? "mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--landing-muted)]"
                    : "mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--app-muted)]"
                }
              >
                Development session
              </span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator
          className={isLanding ? "bg-[var(--landing-border)]" : "bg-[var(--app-border)]"}
        />
        <DropdownMenuItem
          className={
            isLanding
              ? "rounded-[10px] px-2.5 py-2 text-[var(--landing-text)] focus:bg-[var(--landing-chrome-bg)] focus:text-[var(--landing-link)]"
              : "rounded-[10px] px-2.5 py-2 text-[var(--app-text)] focus:bg-[var(--app-panel-muted)] focus:text-[var(--app-text)]"
          }
          onClick={() => router.push("/profile")}
        >
          <UserCircle2 className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        {isDevBypass ? null : (
          <>
            <DropdownMenuSeparator
              className={isLanding ? "bg-[var(--landing-border)]" : "bg-[var(--app-border)]"}
            />
            <DropdownMenuItem
              variant="destructive"
              className="rounded-[10px] px-2.5 py-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarActionDropDown;
