import { SimNodePinTransition, SimTransitionWindow } from "./types";

export interface SimulatorState {
  /**
   * The overall application mode.
   * Might not belong in simulator state?
   *
   * - edit: User is editing, no simulator is running
   * - step: Sim is paused and only ticks on user command
   * - run: Sim is actively running and ticking forwards on its own.
   */
  mode: "edit" | "pause" | "run";

  /**
   * Tick speed in ticks per second when running.
   */
  ticksPerSecond: number;

  /**
   * The current tick the simulator is on.
   */
  tick: number;

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
  mode: "edit",
  ticksPerSecond: 1000,
  tick: 0,
  nodeStatesByNodeId: {},
  nodeOutputValuesByNodeId: {},
  transitionsById: {},
  transitionWindows: [],
};

export const defaultSimulatorState = Object.freeze(_defaultState);
