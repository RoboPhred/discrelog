import { IDMap, Point } from "@/types";
import { NodeType } from "@/node-defs";

import { NodePin } from "@/services/simulator/types";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Point;
  outputs: IDMap<NodePin[]>;
}
