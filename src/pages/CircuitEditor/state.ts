import { Point, IDMap } from "@/types";

import {
  CircuitFieldState,
  defaultCircuitFieldState
} from "./ContentViews/CircuitField/state";

import { ClipboardNode } from "./types";

export interface CircuitEditorState {
  clipboardContent: ClipboardNode[];
  clipboardOrigin: Point | null;
  nodePositions: IDMap<Point>;
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
  circuitField: CircuitFieldState;
}

export const defaultCircuitEditorState: CircuitEditorState = {
  clipboardContent: [],
  clipboardOrigin: null,
  nodePositions: {},
  mouseOverNodeId: null,
  selectedNodeIds: [],
  circuitField: defaultCircuitFieldState
};
