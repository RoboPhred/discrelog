import { Point } from "@/geometry";
import { ROOT_CIRCUIT_ID } from "../circuits/constants";

import { Element, Wire, WireSegment } from "./types";

export interface CircuitGraphServiceState {
  /**
   * Arrays of element ids contained in a circuit by the containing circuit id.
   */
  elementIdsByCircuitId: Record<string, string[]>;

  /**
   * A map of elements by element id.
   */
  elementsById: Record<string, Element>;

  /**
   * Arrays of wire ids contained in a circuit by the containing circuit id.
   */
  wireIdsByCircuitId: Record<string, string[]>;

  /**
   * A map of wire data by the wire id.
   */
  wiresByWireId: Record<string, Wire>;

  /**
   * A map of wire segments by wire segment id.
   */
  wireSegmentsById: Record<string, WireSegment>;

  // FIXME: It ended up being simplier to track positions in graph...
  // Move all layout to graph, and find a better name for graph.
  /**
   * The positions of wire joints.
   */
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: CircuitGraphServiceState = {
  elementIdsByCircuitId: {
    [ROOT_CIRCUIT_ID]: [],
  },
  elementsById: {},
  wireIdsByCircuitId: {},
  wiresByWireId: {},
  wireSegmentsById: {},
  wireJointPositionsByJointId: {},
};

export const defaultCircuitGraphServiceState = Object.freeze(_defaultState);
