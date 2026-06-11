type TButtonProps = {
  label: string;
  command: string;
  onCommand: (command: string) => void;
};

export const Button = ({
  label,
  command,
  onCommand,
}: TButtonProps) => {
  return (
    <button
      onClick={() => onCommand(command)}
      className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90"
    >
      {label}
    </button>
  );
};