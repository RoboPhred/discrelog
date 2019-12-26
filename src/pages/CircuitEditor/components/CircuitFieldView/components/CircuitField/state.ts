import { Point } from "@/types";

import { NodePin } from "@/services/graph/types";

import { DragModeType } from "./types";

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
