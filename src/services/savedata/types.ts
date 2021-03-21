import * as yup from "yup";

import { Point, pointSchema } from "@/geometry";

import { ElementPin, elementPinSchema } from "../element-graph/types";

export interface SaveCircuit {
  circuitId: string;
  circuitName: string;
}
export const saveCircuitSchema = yup.object().shape({
  circuitId: yup.string().required().min(1),
  circuitName: yup.string().required().min(1),
});

export interface SaveElement {
  elementId: string;
  elementType: string;
  elementName: string | null;
  circuitId: string;
  x: number;
  y: number;
}
export const saveElementSchema = yup.object().shape({
  elementId: yup.string().required().min(1),
  elementType: yup.string().required().min(1),
  elementName: yup.string().nullable().min(1),
  circuitId: yup.string().required().min(1),
  x: yup.number().required(),
  y: yup.number().required(),
});

export interface SaveWire {
  output: ElementPin;
  input: ElementPin;
  joints: Point[];
}
export const saveWireSchema = yup.object().shape({
  output: elementPinSchema.required(),
  input: elementPinSchema.required(),
  // Cannot make this required, as yup says required on an array is min length 1...
  joints: yup.array().of(pointSchema),
});

export interface SaveData {
  circuits: SaveCircuit[];
  elements: SaveElement[];
  wires: SaveWire[];
}
export const saveDataSchema = yup.object().shape({
  circuits: yup.array().of(saveCircuitSchema).min(0),
  elements: yup.array().of(saveElementSchema).min(0),
  wires: yup.array().of(saveWireSchema).min(0),
});
