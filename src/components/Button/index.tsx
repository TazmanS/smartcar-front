import type { TCarAction } from "../../api/types/car-action-type";

type TButtonProps = {
  label: string;
  command: TCarAction;
  onCommand: (command: string) => void;
  onStop?: () => void;
};

export const Button = ({
  label,
  command,
  onCommand,
  onStop
}: TButtonProps) => {
  return (
    <button
      onMouseDown={() => onCommand(command)}
      onMouseUp={() => onStop && onStop()}
      className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90"
    >
      {label}
    </button>
  );
};