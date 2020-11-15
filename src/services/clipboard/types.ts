import { ElementType } from "@/element-defs";
import { Point } from "@/geometry";

import { NodePin } from "../graph/types";

export interface ClipboardNode {
  id: string;
  type: ElementType;
  offset: Point;
  outputs: Record<string, NodePin[]>;
}
