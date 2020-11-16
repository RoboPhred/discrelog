import { Point } from "@/geometry";

export interface CircuitLayoutState {
  nodePositionsById: Record<string, Point>;
  wireJointIdsByConnectionId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: CircuitLayoutState = {
  nodePositionsById: {},
  wireJointIdsByConnectionId: {},
  wireJointPositionsByJointId: {},
};

export const defaultCircuitLayoutState: Readonly<CircuitLayoutState> = Object.freeze(
  _defaultState
);
