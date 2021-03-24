import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";
import { WireSegment } from "./types";

export const createCircuitGraphReducer = createServiceReducerCreator(
  "circuitGraph"
);
export const createCircuitGraphSelector = createServiceSelectorCreator(
  "circuitGraph"
);

export function getWireSegmentJoints(segment: WireSegment): string[] {
  switch (segment.type) {
    case "bridge":
      return [segment.jointAId, segment.jointBId];
    case "input":
    case "output":
      return [segment.jointId];
    default:
      return [];
  }
}
