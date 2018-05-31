import { Position } from "@/types";

export interface CircuitFieldState {
  dragMode: null | "move" | "select";
  dragStart: Position | null;
  dragEnd: Position | null;
}

export const defaultCircuitFieldState: CircuitFieldState = {
  dragMode: null,
  dragStart: null,
  dragEnd: null
};
