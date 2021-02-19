import { Node, Connection } from "./types";

export interface NodeGraphServiceState {
  /**
   * A map of nodes by node id.
   */
  nodesById: Record<string, Node>;

  /**
   * A map of connections between nodes, by connection id.
   */
  connectionsById: Record<string, Connection>;
}

const _defaultState: NodeGraphServiceState = {
  nodesById: {},
  connectionsById: {},
};

export const defaultNodeGraphServiceState = Object.freeze(_defaultState);
