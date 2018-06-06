import { Point, Size, IDMap } from "@/types";

import {
  CircuitFieldState,
  defaultCircuitFieldState
} from "./ContentViews/CircuitField/state";

import { ClipboardNode } from "./types";

export interface CircuitEditorState {
  clipboardContent: ClipboardNode[];
  nodePositions: IDMap<Point>;
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
  circuitField: CircuitFieldState;
}

export const defaultCircuitEditorState: CircuitEditorState = {
  clipboardContent: [],
  nodePositions: {},
  mouseOverNodeId: null,
  selectedNodeIds: [],
  circuitField: defaultCircuitFieldState
};
