import { IDMap, Point } from "@/types";

import { NodePin } from "@/services/simulator/types";
import { NodeType } from "@/services/simulator/node-types";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Point;
  outputs: IDMap<NodePin[]>;
}
