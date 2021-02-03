import * as yup from "yup";

import { NodeType } from "@/nodes";
import { Point, pointSchema } from "@/geometry";

import { NodePin, nodePinSchema } from "../circuit-graph/types";

export interface SaveNode {
  nodeId: string;
  nodeType: NodeType;
  x: number;
  y: number;
}
export const saveNodeSchema = yup.object().shape({
  nodeId: yup.string().required().min(1),
  nodeType: yup.string().required().min(1), // TODO: Check for valid element types
  x: yup.number().required(),
  y: yup.number().required(),
});

export interface SaveWire {
  output: NodePin;
  input: NodePin;
  joints: Point[];
}
export const saveWireSchema = yup.object().shape({
  output: nodePinSchema.required(),
  input: nodePinSchema.required(),
  // Cannot make this required, as yup says required on an array is min length 1...
  joints: yup.array().of(pointSchema),
});

export interface SaveData {
  nodes: SaveNode[];
  wires: SaveWire[];
}
export const saveDataSchema = yup.object().shape({
  // Cannot make any of these required, as yup says required on an array is min length 1...
  nodes: yup.array().of(saveNodeSchema),
  wires: yup.array().of(saveWireSchema),
});
