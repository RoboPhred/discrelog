import { Point } from "@/geometry";

export interface CircuitLayoutServiceState {
  elementPositionsById: Record<string, Point>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: CircuitLayoutServiceState = {
  elementPositionsById: {},
  wireJointPositionsByJointId: {},
};

export const defaultCircuitLayoutServiceState: Readonly<CircuitLayoutServiceState> = Object.freeze(
  _defaultState
);
