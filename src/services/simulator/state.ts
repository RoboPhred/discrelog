import { SimNodePinTransition, SimTransitionWindow } from "./types";

export interface SimulatorState {
  /**
   * The current tick the simulator is on.
   */
  tick: number;

  /**
   * The time it took in milliseconds to process the last tick.
   */
  lastTickProcessingTimeMs: number;

  /**
   * A map of node states by node id.
   */
  nodeStatesByNodeId: Record<string, any>;

  /**
   * A map of output-to-value maps by node id.
   */
  nodeOutputValuesByNodeId: Record<string, Record<string, boolean>>;

  /**
   * A map of pending transitions by id.
   */
  transitionsById: Record<string, SimNodePinTransition>;

  /**
   * Transition windows in ascending order of tick.
   */
  transitionWindows: SimTransitionWindow[];
}

const _defaultState: SimulatorState = {
  tick: 0,
  lastTickProcessingTimeMs: 0,
  nodeStatesByNodeId: {},
  nodeOutputValuesByNodeId: {},
  transitionsById: {},
  transitionWindows: [],
};

export const defaultSimulatorState = Object.freeze(_defaultState);
