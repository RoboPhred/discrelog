import { Position, Size } from "@/types";

import {
  CircuitFieldState,
  defaultCircuitFieldState
} from "./ContentViews/CircuitField/state";

export interface CircuitEditorState {
  nodePositions: {
    [key: string]: Position;
  };
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
