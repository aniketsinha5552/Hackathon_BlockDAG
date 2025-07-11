import { cn } from "../lib/utils";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl shadow-md bg-white dark:bg-[#1a1b1e] p-4">{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-center text-sm", className)}>{children}</div>;
}