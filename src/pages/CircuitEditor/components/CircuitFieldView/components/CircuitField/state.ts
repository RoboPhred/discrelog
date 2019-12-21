import { Point } from "@/types";

import { DragModeType } from "../../types";
import { NodePin } from "@/services/simulator";

export interface CircuitFieldState {
  dragMode: DragModeType | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  selectedPin: NodePin | null;
}

export const defaultCircuitFieldState: CircuitFieldState = {
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  selectedPin: null
};
