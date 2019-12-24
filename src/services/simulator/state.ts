import { IDMap, Connection } from "@/types";

import {
  SimNodesById,
  SimNodePinTransition,
  SimTransitionWindow
} from "./types";

export interface SimulatorState {
  /**
   * The current tick the simulator is on.
   */
  tick: number;

  /**
   * A map of nodes by node id.
   */
  nodesById: SimNodesById;

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
  transitionsById: IDMap<SimNodePinTransition>;

  /**
   * Transition windows in ascending order of tick.
   */
  transitionWindows: SimTransitionWindow[];
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
