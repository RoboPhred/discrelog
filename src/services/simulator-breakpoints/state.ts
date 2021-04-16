export interface Breakpoint {
  valueExpression: string;
  trigger: "true" | "false" | "change";
}

export interface SimulatorBreakpointsState {
  breakpointsById: Record<string, Breakpoint>;
  breakpointLastValuesById: Record<string, boolean>;
}
