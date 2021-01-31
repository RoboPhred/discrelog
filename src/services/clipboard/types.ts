import { NodeType } from "@/nodes";
import { Point } from "@/geometry";

import { NodePin } from "../circuit-graph/types";

export interface ClipboardNode {
  id: string;
  nodeType: NodeType;
  offset: Point;
  outputs: Record<string, NodePin[]>;
}
