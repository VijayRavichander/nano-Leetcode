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

const NavbarActionDropDown = ({ session }: { session: NavbarSession }) => {
  const router = useRouter();

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
        className="
          cursor-pointer rounded-md
          bg-neutral-950 px-2 text-xs! text-white/90
          transition-all hover:bg-linear-to-b hover:text-white
          to-neutral-900 from-neutral-800
          focus:outline-none
          data-[state=open]:scale-[1.01]
        "
      >
        {session.data?.user?.name || session.data?.user?.email || "User"}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="cursor-pointer border border-white/10 bg-neutral-900 font-sm text-white/90">
        <DropdownMenuItem className="hover:bg-white/90!">Profile</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-white/90!" onClick={handleSignOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarActionDropDown;
