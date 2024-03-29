import { MaybeArray } from "@/arrays";

export type PinDirection = "input" | "output";

export interface OutputTransition {
  /**
   * The offset from the current tick to execute this transition.
   */
  tickOffset: number;

  /**
   * A map of values by pin output to transition to.
   * Pins not specified will mantain their original value.
   */
  valuesByPin: Record<string, boolean>;

  /**
   * How to handle other scheduled transitions on this evolver.
   * - replace: This transition will replace other transitions on this evolver.
   * - append: This transition will be scheduled in addition to previous transitions.
   *
   * Default: replace
   */
  transitionMerger?: "replace" | "append";
}

export interface EvolutionResult {
  /**
   * The new evolver state to use.
   */
  state?: any;

  /**
   * Pin value changes to schedule.
   */
  transitions?: MaybeArray<OutputTransition>;
}
