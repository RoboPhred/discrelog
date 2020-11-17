import * as yup from "yup";

import { ElementType } from "@/element-defs";
import { Point, pointSchema } from "@/geometry";

import { NodePin, nodePinSchema } from "../circuit-graph/types";

export interface SaveNode {
  nodeId: string;
  elementType: ElementType;
  x: number;
  y: number;
}
export const saveNodeSchema = yup.object().shape({
  nodeId: yup.string().required().min(1),
  elementType: yup.string().required().min(1), // TODO: Check for valid element types
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
  joints: yup.array().required().of(pointSchema),
});

export interface SaveData {
  nodes: SaveNode[];
  wires: SaveWire[];
}
export const saveDataSchema = yup.object().shape({
  nodes: yup.array().required().of(saveNodeSchema),
  wires: yup.array().required().of(saveWireSchema),
});
