import { Wire, GraphNode } from "./types";

export interface GraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: Record<string, GraphNode>;

  /**
   * A map of wires connecting nodes.
   */
  wiresById: Record<string, Wire>;
}

const _defaultState: GraphState = {
  nodesById: {},
  wiresById: {},
};

export const defaultGraphState = Object.freeze(_defaultState);
