import { IDMap } from "@/types";

import { NodesById, NodePinTransition, TransitionWindow } from "./types";

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
   * A map of output-to-value maps by node id.
   */
  nodeOutputValuesByNodeId: IDMap<IDMap<boolean>>;

  /**
   * A map of the the ids of the pending transitions for a node by node id.
   */
  nodeOutputTransitionsByNodeId: IDMap<IDMap<string | null>>;

  // Not entirely happy having this on the state, since it is
  //  highly transient and has a lot of churn.
  // However, this greatly simplifies the one-transition-per-pin logic.
  //  Without this, either the logic to add or logic to apply transitions would have
  //  to do a deep scan of the other's state data.
  // Note: turns out one-transition-per-pin is "intertial" delay,
  //  while some elements have a "buffer" delay.
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
  nodeOutputTransitionsByNodeId: {},
  transitionsById: {},
  transitionWindows: []
};
