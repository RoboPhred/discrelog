import { IDMap } from "@/types";

import { SimNodePinTransition, SimTransitionWindow } from "./types";

export interface SimulatorState {
  /**
   * The current tick the simulator is on.
   */
  tick: number;

  /**
   * A map of node states by node id.
   */
  nodeStatesByNodeId: IDMap<any>;

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

const _defaultState: SimulatorState = {
  tick: 0,
  nodeStatesByNodeId: {},
  nodeOutputValuesByNodeId: {},
  transitionsById: {},
  transitionWindows: []
};

export const defaultSimulatorState = Object.freeze(_defaultState);
