import { Wire, GraphNode } from "./types";

export interface CircuitGraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: Record<string, GraphNode>;

  /**
   * A map of wires connecting nodes.
   */
  wiresById: Record<string, Wire>;
}

const _defaultState: CircuitGraphState = {
  nodesById: {},
  wiresById: {},
};

export const defaultCircuitGraphState = Object.freeze(_defaultState);
