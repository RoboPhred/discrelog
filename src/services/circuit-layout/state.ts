import { Point } from "@/geometry";

export interface CircuitLayoutServiceState {
  elementPositionsById: Record<string, Point>;
  connectionJointIdsByConnectionId: Record<string, string[]>;
  connectionJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: CircuitLayoutServiceState = {
  elementPositionsById: {},
  connectionJointIdsByConnectionId: {},
  connectionJointPositionsByJointId: {},
};

export const defaultCircuitLayoutServiceState: Readonly<CircuitLayoutServiceState> = Object.freeze(
  _defaultState
);
