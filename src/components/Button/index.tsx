import type { TCarAction } from "../../api/types/car-action-type";

type ButtonProps = {
  label: string;
  command: TCarAction;
  onCommand: (command: TCarAction) => void;
  onStop?: () => void;
  className?: string;
};

export const Button = ({ label, command, onCommand, onStop, className = "" }: ButtonProps) => (
  <button
    type="button"
    onPointerDown={(event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      onCommand(command);
    }}
    onPointerUp={() => onStop?.()}
    onPointerCancel={onStop}
    className={`min-w-24 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-500 active:bg-blue-700 ${className}`}
  >
    {label}
  </button>
);
