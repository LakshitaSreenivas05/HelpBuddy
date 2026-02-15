import { UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

export function Avatar({
  src,
  alt,
  className,
  size = "md",
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? "User avatar"} className="h-full w-full object-cover" />
      ) : (
        <UserIcon className="h-2/3 w-2/3" />
      )}
    </div>
  );
}

