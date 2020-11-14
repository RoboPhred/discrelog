import { IDMap } from "@/types";

import { Wire, GraphNode } from "./types";

export interface GraphState {
  /**
   * A map of nodes by node id.
   */
  nodesById: IDMap<GraphNode>;

  /**
   * A map of wires connecting nodes.
   */
  wiresById: IDMap<Wire>;
}

const _defaultState: GraphState = {
  nodesById: {},
  wiresById: {},
};

export const defaultGraphState = Object.freeze(_defaultState);
