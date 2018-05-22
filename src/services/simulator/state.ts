import { IDMap } from "@/types";

import { Node, NodesById, NodePinTransition, TransitionWindow } from "./types";

import { NodeType } from "./node-types";

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
  nodeOutputTransitionsByNodeId: IDMap<IDMap<string>>;

  // Not entirely happy having this on the state, since it is
  //  highly transient and has a lot of churn.
  // However, thisthis greatly simplifies the one-transition-per-pin logic.
  //  Without this, either the logic to add or logic to apply transitions would have
  //  to do a deep scan of the other's state data.
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
  nodesById: {
    "toggle-a": {
      id: "toggle-a",
      type: "toggle",
      inputConnectionsByPin: {},
      outputConnectionsByPin: {
        OUT: [{ nodeId: "and", pin: "A" }]
      }
    },
    "toggle-b": {
      id: "toggle-b",
      type: "toggle",
      inputConnectionsByPin: {},
      outputConnectionsByPin: {
        OUT: [{ nodeId: "and", pin: "B" }]
      }
    },
    and: {
      id: "and",
      type: "and",
      inputConnectionsByPin: {
        A: { nodeId: "toggle-a", pin: "OUT" },
        B: { nodeId: "toggle-b", pin: "OUT" }
      },
      outputConnectionsByPin: {
        OUT: [{ nodeId: "out-led", pin: "IN" }]
      }
    },
    "out-led": {
      id: "out-led",
      type: "led",
      inputConnectionsByPin: {
        IN: { nodeId: "and", pin: "OUT" }
      },
      outputConnectionsByPin: {}
    }
  },
  nodeStatesByNodeId: {
    "toggle-a": {
      toggleState: false
    },
    "toggle-b": {
      toggleState: false
    }
  },
  nodeOutputValuesByNodeId: {
    "toggle-a": {
      OUT: false
    },
    "toggle-b": {
      OUT: false
    },
    and: {
      OUT: false
    },
    "out-led": {}
  },
  nodeOutputTransitionsByNodeId: {},
  transitionsById: {},
  transitionWindows: []
};
