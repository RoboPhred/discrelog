import { Point } from "@/geometry";

import { WireSegment } from "../circuit-graph/types";

export interface SaveCircuit {
  circuitId: string;
  circuitName: string;
}

export interface SaveElement {
  elementId: string;
  elementType: string;
  elementName: string | null;
  circuitId: string;
  x: number;
  y: number;
}

export type SaveWireSegment = WireSegment & {
  wireSegmentId: string;
};

export interface SaveWireJoint extends Point {
  jointId: string;
}

export interface SaveWire {
  wireId: string;
  wireSegments: SaveWireSegment[];
  wireJoints: SaveWireJoint[];
}

export interface SaveData {
  circuits: SaveCircuit[];
  elements: SaveElement[];
  wires: SaveWire[];
}

export function validateSaveData(data: SaveData) {
  // TODO: Validate save data
}
