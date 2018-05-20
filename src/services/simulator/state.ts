import { IDMap } from "@/types";

import { Node, NodesById, PendingTransition } from "./types";

import { NodeType } from "./node-types";

export interface TransitionWindow {
  tick: number;
  transitions: PendingTransition[];
}

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
   * Transitions windowed by tick, sorted ascending
   * on tick.
   */
  transitionWindows: TransitionWindow[];
}

// export const defaultSimulatorState: SimulatorState = {
//     tick: 0,
//     nodes: {},
//     nodeStates: {},
//     edges: {},
//     edgeValues: {},
//     transitionWindows: []
// };

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
  transitionWindows: []
};
