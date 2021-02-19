export interface SimNodePinTransition {
  nodeId: string;
  tick: number;
  valuesByOutputPin: Record<string, boolean>;
}

export interface SimTransitionWindow {
  /**
   * The tick represented by this window.
   */
  tick: number;

  /**
   * The transitions contained in this window.
   */
  transitionIds: string[];
}
