import { IDMap } from "@/types";

import { NodeType } from "./node-types";

export interface Node {
  id: string;
  type: NodeType;
  inputConnectionsByPin: IDMap<NodePin | null>;
  outputConnectionsByPin: IDMap<NodePin[]>;
}

export type NodesById = IDMap<Node>;

/**
 * Identifies a pin on a specific node.
 */
export interface NodePin {
  nodeId: string;
  pin: string;
}

export type PinValueMap = IDMap<boolean>;

export interface NodePinTransition {
  id: string;
  nodeId: string;
  outputId: string;
  tick: number;
  value: boolean;
}

export interface TransitionWindow {
  /**
   * The tick represented by this window.
   */
  tick: number;

  /**
   * The transitions contained in this window.
   */
  transitionIds: string[];
}
