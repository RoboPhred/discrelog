import { Point } from "@/types";

import { DragModeType } from "./types";
import { NodePin, NodePinDirection } from "@/services/simulator";

export interface SelectedPinState extends NodePin {
  direction: NodePinDirection;
}

export interface CircuitFieldState {
  dragMode: DragModeType | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  selectedPin: SelectedPinState | null;
}

export const defaultCircuitFieldState: CircuitFieldState = {
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  selectedPin: null
};
