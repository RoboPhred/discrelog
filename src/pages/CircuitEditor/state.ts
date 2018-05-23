import { Position, Size } from "@/types";

export interface CircuitEditorState {
  nodePositions: {
    [key: string]: Position;
  };
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
}

export const defaultCircuitEditorState: CircuitEditorState = {
  nodePositions: {
    "toggle-a": {
      x: 0,
      y: 0
    },
    "toggle-b": {
      x: 0,
      y: 100
    },
    and: {
      x: 100,
      y: 50
    },
    "out-led": {
      x: 200,
      y: 50
    }
  },
  mouseOverNodeId: null,
  selectedNodeIds: []
};
