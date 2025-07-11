export function Step2({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-blue-500 dark:text-blue-300">{icon}</div>
        <span>{label}</span>
      </div>
    );
  }