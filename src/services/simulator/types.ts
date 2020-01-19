import { IDMap } from "@/types";

export interface SimNodePinTransition {
  id: string;
  nodeId: string;
  tick: number;
  valuesByOutputPin: IDMap<boolean>;
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
