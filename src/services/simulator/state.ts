import { EvolverPinTransition, SimTransitionWindow } from "./types";

export interface SimulatorServiceState {
  /**
   * Whether the simulator has been initialized.
   */
  initialized: boolean;

  /**
   * The current tick the simulator is on.
   */
  tick: number;

  /**
   * The time it took in milliseconds to process the last tick.
   */
  lastTickProcessingTimeMs: number;

  /**
   * A map of evolver states by evolver id.
   */
  evolverStatesByEvolverId: Record<string, any>;

  /**
   * A map of output-to-value maps by node id.
   */
  evolverOutputValuesByEvolverId: Record<string, Record<string, boolean>>;

  /**
   * A map of pending transitions by id.
   */
  transitionsById: Record<string, EvolverPinTransition>;

  /**
   * Transition windows in ascending order of tick.
   */
  transitionWindows: SimTransitionWindow[];
}

const _defaultState: SimulatorServiceState = {
  initialized: false,
  tick: 0,
  lastTickProcessingTimeMs: 0,
  evolverStatesByEvolverId: {},
  evolverOutputValuesByEvolverId: {},
  transitionsById: {},
  transitionWindows: [],
};

export const defaultSimulatorServiceState = Object.freeze(_defaultState);
