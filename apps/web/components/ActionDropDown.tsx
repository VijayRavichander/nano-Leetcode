import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const NavbarActionDropDown = ({ session }: { session: any }) => {
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
          bg-neutral-950 shadow-bevel-s
          text-white/90 hover:text-white
          text-xs!
          px-2 rounded-md
          transition-all
          cursor-pointer focus:outline-none
          data-[state=open]:scale-[1.01]
          hover:bg-linear-to-b to-neutral-900 from-neutral-800
        "
      >
        {session.data?.user?.name || session.data?.user?.email || "User"}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-900 text-white/90 border border-white/10 cursor-pointer font-sm">
        <DropdownMenuItem className="hover:bg-white/90!">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-white/90!"
          onClick={handleSignOut}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarActionDropDown;
