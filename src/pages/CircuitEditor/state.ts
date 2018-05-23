import { Position, Size } from "@/types";

export interface CircuitEditorState {
  nodePositions: {
    [key: string]: Position;
  };
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
}

export const defaultCircuitEditorState: CircuitEditorState = {
  nodePositions: {},
  mouseOverNodeId: null,
  selectedNodeIds: []
};
