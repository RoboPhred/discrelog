import { IDMap } from "@/types";
import { NodeType } from "@/node-defs";

export interface SimNode {
  id: string;
  type: NodeType;
}

export type SimNodesById = IDMap<SimNode>;

export interface SimNodePinTransition {
  id: string;
  nodeId: string;
  outputId: string;
  tick: number;
  value: boolean;
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
