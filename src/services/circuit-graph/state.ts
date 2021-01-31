import { Node, Connection } from "./types";

export interface CircuitGraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: Record<string, Node>;

  /**
   * A map of connections between nodes, by connection id.
   */
  connectionsById: Record<string, Connection>;
}

const _defaultState: CircuitGraphState = {
  nodesById: {},
  connectionsById: {},
};

export const defaultCircuitGraphState = Object.freeze(_defaultState);
