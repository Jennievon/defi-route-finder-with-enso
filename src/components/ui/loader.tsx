import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  text?: string;
}

export function Loader({
  size = "default",
  text = "Loading...",
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      <Loader2
        className={cn("animate-spin", {
          "h-4 w-4": size === "sm",
          "h-8 w-8": size === "default",
          "h-12 w-12": size === "lg",
        })}
      />
      {text && (
        <p
          className={cn("text-muted-foreground", {
            "text-sm": size === "sm",
            "text-base": size === "default",
            "text-lg": size === "lg",
          })}
        >
          {text}
        </p>
      )}
    </div>
  );
}
