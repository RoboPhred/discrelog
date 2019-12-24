import { NodeType } from "@/node-defs";
import { Point, IDMap, NodePin } from "@/types";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Point;
  outputs: IDMap<NodePin[]>;
}
