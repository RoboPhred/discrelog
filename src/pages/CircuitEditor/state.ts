import { Position, Size, IDMap } from "@/types";

import {
  CircuitFieldState,
  defaultCircuitFieldState
} from "./ContentViews/CircuitField/state";

export interface CircuitEditorState {
  nodePositions: IDMap<Position>;
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
  circuitField: CircuitFieldState;
}

export const defaultCircuitEditorState: CircuitEditorState = {
  nodePositions: {},
  mouseOverNodeId: null,
  selectedNodeIds: [],
  circuitField: defaultCircuitFieldState
};
