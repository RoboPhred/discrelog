import { ElementType } from "@/element-defs";
import { Point, IDMap } from "@/types";

import { NodePin } from "../graph/types";

export interface ClipboardNode {
  id: string;
  type: ElementType;
  offset: Point;
  outputs: IDMap<NodePin[]>;
}
