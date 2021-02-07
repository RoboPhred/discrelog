import { Node, Connection } from "./types";

export interface NodeGraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: Record<string, Node>;

  /**
   * A map of connections between nodes, by connection id.
   */
  connectionsById: Record<string, Connection>;
}

const _defaultState: NodeGraphState = {
  nodesById: {},
  connectionsById: {},
};

export const defaultNodeGraphState = Object.freeze(_defaultState);
