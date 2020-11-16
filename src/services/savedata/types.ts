import { ElementType } from "@/element-defs";
import { Point } from "@/geometry";

import { NodePin } from "../circuit-graph/types";

export interface SaveData {
  nodes: SaveNode[];
  wires: SaveWire[];
}

export interface SaveNode {
  id: string;
  type: ElementType;
  x: number;
  y: number;
}

export interface SaveWire {
  output: NodePin;
  input: NodePin;
  joints: Point[];
}
