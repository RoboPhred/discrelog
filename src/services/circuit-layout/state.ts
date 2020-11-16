import { Point } from "@/geometry";

export interface CircuitLayoutState {
  nodePositionsById: Record<string, Point>;
  wireJointIdsByWireId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: CircuitLayoutState = {
  nodePositionsById: {},
  wireJointIdsByWireId: {},
  wireJointPositionsByJointId: {},
};

export const defaultCircuitLayoutState: Readonly<CircuitLayoutState> = Object.freeze(
  _defaultState
);
