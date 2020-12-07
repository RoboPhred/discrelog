import { ElementType } from "@/elements";
import { Point } from "@/geometry";

import { NodePin } from "../circuit-graph/types";

export interface ClipboardNodeBase {
  id: string;
  type: string;
  offset: Point;
}

export interface ClipboardElement extends ClipboardNodeBase {
  type: "element";
  elementType: ElementType;
  outputs: Record<string, NodePin[]>;
}
export type ClipboardNode = ClipboardElement;
