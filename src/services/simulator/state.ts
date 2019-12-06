import { IDMap } from "@/types";

import {
  NodesById,
  NodePinTransition,
  TransitionWindow,
  Connection
} from "./types";

export interface SimulatorState {
  /**
   * The current tick the simulator is on.
   */
  tick: number;

  /**
   * A map of nodes by node id.
   */
  nodesById: NodesById;

  /**
   * A map of node states by node id.
   */
  nodeStatesByNodeId: IDMap<any>;

  /**
   * A list of node pin to node pin connections.
   */
  connections: Connection[];

  /**
   * A map of output-to-value maps by node id.
   */
  nodeOutputValuesByNodeId: IDMap<IDMap<boolean>>;

  /**
   * A map of pending transitions by id.
   */
  transitionsById: IDMap<NodePinTransition>;

  /**
   * Transition windows in ascending order of tick.
   */
  transitionWindows: TransitionWindow[];
}

export const defaultSimulatorState: SimulatorState = {
  tick: 0,
  nodesById: {},
  nodeStatesByNodeId: {},
  nodeOutputValuesByNodeId: {},
  connections: [],
  transitionsById: {},
  transitionWindows: []
};
