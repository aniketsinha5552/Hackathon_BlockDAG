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
        "rounded px-4 py-2 font-medium transition-colors duration-200",
        variant === "default"
          ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          : "border border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20",
        className
      )}
    >
      {children}
    </button>
  );
}
