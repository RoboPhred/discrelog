import * as yup from "yup";

import { Point, pointSchema } from "@/geometry";

import { NodePin, nodePinSchema } from "../node-graph/types";

export interface SaveCircuit {
  circuitId: string;
  circuitName: string;
}
export const saveCircuitSchema = yup.object().shape({
  circuitId: yup.string().required().min(1),
  circuitName: yup.string().required().min(1),
});

export interface SaveNode {
  nodeId: string;
  nodeType: string;
  nodeName: string | null;
  circuitId: string;
  x: number;
  y: number;
}
export const saveNodeSchema = yup.object().shape({
  nodeId: yup.string().required().min(1),
  nodeType: yup.string().required().min(1),
  nodeName: yup.string().nullable().min(1),
  circuitId: yup.string().required().min(1),
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
  circuits: SaveCircuit[];
  nodes: SaveNode[];
  wires: SaveWire[];
}
export const saveDataSchema = yup.object().shape({
  circuits: yup.array().of(saveCircuitSchema).min(0),
  nodes: yup.array().of(saveNodeSchema).min(0),
  wires: yup.array().of(saveWireSchema).min(0),
});
