export interface SimulatorControlState {
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
}

const _defaultState: SimulatorControlState = {
  mode: "edit",
  ticksPerSecond: 1000,
};

export const defaultSimulatorControlState = Object.freeze(_defaultState);
