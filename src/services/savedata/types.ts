import * as yup from "yup";

import { Point } from "@/geometry";

import { WireSegment, wireSegmentSchema } from "../circuit-graph/types";

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

export type SaveWireSegment = WireSegment & {
  wireSegmentId: string;
};
const saveWireSegmentSchema = wireSegmentSchema.concat(
  yup.object({
    wireSchemaId: yup.string().required(),
  }) as any
);

export interface SaveWireJoint extends Point {
  jointId: string;
}
const saveWireJointSchema = yup.object({
  x: yup.number().required(),
  y: yup.number().required(),
  jointId: yup.string().required().min(1),
});

export interface SaveWire {
  wireId: string;
  wireSegments: WireSegment[];
  wireJoints: SaveWireJoint[];
}
const saveWireSchema = yup.object({
  wireId: yup.string().required().min(1),
  wireSegments: yup.array().of(saveWireSegmentSchema),
  wireJoints: yup.array().of(saveWireJointSchema),
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
