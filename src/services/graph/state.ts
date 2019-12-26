import { NodesById, Connection } from "./types";

export interface GraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: NodesById;

  /**
   * A list of node pin to node pin connections.
   */
  connections: Connection[];
}

const _defaultState: GraphState = {
  nodesById: {},
  connections: []
};

export const defaultGraphState = Object.freeze(_defaultState);
