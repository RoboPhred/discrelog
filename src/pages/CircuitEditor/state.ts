import { Point, IDMap } from "@/types";

import {
  CircuitFieldState,
  defaultCircuitFieldState
} from "./components/CircuitFieldView/components/CircuitField/state";

import { ClipboardNode } from "./types";

export interface CircuitEditorState {
  clipboardContent: ClipboardNode[];
  clipboardOrigin: Point | null;
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
  circuitField: CircuitFieldState;
}

export const defaultCircuitEditorState: CircuitEditorState = {
  clipboardContent: [],
  clipboardOrigin: null,
  mouseOverNodeId: null,
  selectedNodeIds: [],
  circuitField: defaultCircuitFieldState
};
