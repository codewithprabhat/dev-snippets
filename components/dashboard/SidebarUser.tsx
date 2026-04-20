"use client";

import Link from "next/link";
import { useTransition } from "react";
import { LogOut, User } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/UserAvatar";
import { useSidebar } from "@/components/dashboard/SidebarContext";
import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

type SidebarUserProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function SidebarUser({ user }: SidebarUserProps) {
  const { collapsed } = useSidebar();
  const [pending, startTransition] = useTransition();

  const displayName = user.name?.trim() || user.email || "Account";

  const trigger = (
    <button
      type="button"
      aria-label="Open account menu"
      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <UserAvatar
        name={user.name}
        email={user.email}
        image={user.image}
        className="cursor-pointer"
      />
    </button>
  );

  const menu = (
    <DropdownMenuContent
      side={collapsed ? "right" : "top"}
      align={collapsed ? "start" : "start"}
      className="w-56"
    >
      <DropdownMenuLabel className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{displayName}</span>
        {user.email && (
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/profile">
          <User className="size-4" />
          View profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={pending}
        onSelect={(e) => {
          e.preventDefault();
          startTransition(() => signOutAction());
        }}
      >
        <LogOut className="size-4" />
        {pending ? "Signing out…" : "Sign out"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="font-medium">{displayName}</p>
            {user.email && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            )}
          </TooltipContent>
        </Tooltip>
        {menu}
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("flex items-center gap-3")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        {menu}
      </DropdownMenu>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{displayName}</p>
        {user.email && (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
    </div>
  );
}
