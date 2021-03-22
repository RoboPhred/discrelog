import { Point } from "@/geometry";

import { ElementPin } from "../circuit-graph/types";

export interface ClipboardElementOutput {
  pin: ElementPin;
  joints: Point[];
}
export interface ClipboardElement {
  id: string;
  elementType: string;
  offset: Point;
  outputs: Record<string, ClipboardElementOutput[]>;
}
