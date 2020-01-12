import { IDMap } from "@/types";

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
  mode: "edit" | "step" | "run";

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
  mode: "edit",
  ticksPerSecond: 10,
  tick: 0,
  nodeStatesByNodeId: {},
  nodeOutputValuesByNodeId: {},
  transitionsById: {},
  transitionWindows: []
};

export const defaultSimulatorState = Object.freeze(_defaultState);
