import { cn } from "../lib/utils";
export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline"; }) {
  return (
    <button
      {...props}
      className={cn(
        "rounded px-4 py-2 font-medium",
        variant === "default"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-blue-600 text-blue-600 hover:bg-blue-100",
        className
      )}
    >
      {children}
    </button>
  );
}
