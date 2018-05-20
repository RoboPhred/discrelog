import { IDMap } from "@/types";

import { NodeType } from "./node-types";

export interface Node {
  id: string;
  type: NodeType;
  inputConnectionsByPin: IDMap<PinConnection | null>;
  outputConnectionsByPin: IDMap<PinConnection[]>;
}

export interface NodesById {
  [key: string]: Node;
}

export interface PinConnection {
  nodeId: string;
  pin: string;
}

export interface PendingTransition {
  nodeId: string;
  outputPinId: string;
  value: boolean;
}
