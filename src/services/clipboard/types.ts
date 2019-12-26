import { NodeType } from "@/node-defs";
import { Point, IDMap } from "@/types";

import { NodePin } from "../graph/types";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Point;
  outputs: IDMap<NodePin[]>;
}
