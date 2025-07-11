export function Step({
  icon,
  label,
  bold = false,
}: {
  icon: React.ReactNode;
  label: string;
  bold?: boolean;
}) {
  return (
    <div className="flex flex-col items-center w-44 text-center space-y-2">
      <div className="text-blue-500 text-2xl">{icon}</div>
      <span className={`text-sm ${bold ? "font-semibold" : ""}`}>{label}</span>
    </div>
  );
}
