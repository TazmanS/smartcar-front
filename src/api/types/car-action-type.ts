export const CarAction = {
  Forward: "forward",
  Backward: "backward",
  Left: "left",
  Right: "right",
  Stop: "stop",
} as const;

export type TCarAction = typeof CarAction[keyof typeof CarAction];