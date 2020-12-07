import { ElementType } from "@/elements";
import { Point } from "@/geometry";
import { NodePin } from "../circuit-graph/types";

export interface CircuitEditorUiState {
  viewScale: number;
  // TODO: Drag stuff should probably be its own service.
  dragMode: "move" | "select" | "new-element" | "wire" | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  dragNewElementType: ElementType | null;
  dragWireSource: NodePin | null;
}

const _defaultState: CircuitEditorUiState = {
  viewScale: 1,
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  dragNewElementType: null,
  dragWireSource: null,
};

export const defaultCircuitEditorUiState = Object.freeze(_defaultState);
