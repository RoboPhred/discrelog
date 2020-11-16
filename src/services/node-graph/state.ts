import { Wire, GraphNode } from "./types";

export interface NodeGraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: Record<string, GraphNode>;

  /**
   * A map of wires connecting nodes.
   */
  wiresById: Record<string, Wire>;
}

const _defaultState: NodeGraphState = {
  nodesById: {},
  wiresById: {},
};

export const defaultNodeGraphState = Object.freeze(_defaultState);
