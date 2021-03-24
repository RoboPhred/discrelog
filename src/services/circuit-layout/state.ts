import { Point } from "@/geometry";

export interface CircuitLayoutServiceState {
  elementPositionsById: Record<string, Point>;
}

const _defaultState: CircuitLayoutServiceState = {
  elementPositionsById: {},
};

export const defaultCircuitLayoutServiceState: Readonly<CircuitLayoutServiceState> = Object.freeze(
  _defaultState
);
