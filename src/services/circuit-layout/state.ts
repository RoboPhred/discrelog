import { Point } from "@/geometry";

export interface CircuitLayoutServiceState {
  elementPositionsById: Record<string, Point>;
  wireJointIdsByConnectionId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: CircuitLayoutServiceState = {
  elementPositionsById: {},
  wireJointIdsByConnectionId: {},
  wireJointPositionsByJointId: {},
};

export const defaultCircuitLayoutServiceState: Readonly<CircuitLayoutServiceState> = Object.freeze(
  _defaultState
);
