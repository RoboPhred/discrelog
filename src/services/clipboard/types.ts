import { Point } from "@/geometry";

import { NodePin } from "../node-graph/types";

export interface ClipboardNodeOutput {
  pin: NodePin;
  joints: Point[];
}
export interface ClipboardNode {
  id: string;
  nodeType: string;
  offset: Point;
  outputs: Record<string, ClipboardNodeOutput[]>;
}
