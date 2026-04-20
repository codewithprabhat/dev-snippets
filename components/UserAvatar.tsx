import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function getUserInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function UserAvatar({ name, email, image, size = "default", className }: UserAvatarProps) {
  const initials = getUserInitials(name, email);
  const alt = name || email || "User avatar";

  return (
    <Avatar size={size} className={cn(className)}>
      {image ? <AvatarImage src={image} alt={alt} /> : null}
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}
