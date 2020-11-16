import { ElementType } from "@/element-defs";
import { Point } from "@/geometry";

export interface CircuitEditorUiState {
  viewScale: number;
  dragMode: "move" | "select" | "new-element" | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  dragNewElementType: ElementType | null;
}

const _defaultState: CircuitEditorUiState = {
  viewScale: 1,
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  dragNewElementType: null,
};

export const defaultCircuitEditorUiState = Object.freeze(_defaultState);
