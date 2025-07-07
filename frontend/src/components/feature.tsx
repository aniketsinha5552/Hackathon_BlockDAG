export function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-white p-2 rounded-full">
        {icon}
      </div>
      <span className="text-sm font-medium max-w-[10rem] text-center">{text}</span>
    </div>
  );
}