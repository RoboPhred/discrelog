import { IDMap, Point, NodePin } from "@/types";
import { NodeType } from "@/node-defs";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Point;
  outputs: IDMap<NodePin[]>;
}
