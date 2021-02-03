import { NodeType } from "@/nodes";
import { Point } from "@/geometry";

import { NodePin } from "../node-graph/types";

export interface ClipboardNode {
  id: string;
  nodeType: NodeType;
  offset: Point;
  outputs: Record<string, NodePin[]>;
}
