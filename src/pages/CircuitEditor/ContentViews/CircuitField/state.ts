import { Point, IDMap } from "@/types";

export interface CircuitFieldState {
  dragMode: null | "move" | "select";
  dragStart: Point | null;
  dragEnd: Point | null;
}

export const defaultCircuitFieldState: CircuitFieldState = {
  dragMode: null,
  dragStart: null,
  dragEnd: null
};
