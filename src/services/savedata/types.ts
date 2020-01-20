import { NodeType } from "@/node-defs";
import { Point } from "@/types";

import { NodePin } from "../graph/types";

export interface SaveData {
  nodes: SaveNode[];
  wires: SaveWire[];
}

export interface SaveNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
}

export interface SaveWire {
  output: NodePin;
  input: NodePin;
  joints: Point[];
}
