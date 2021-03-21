import { Point } from "@/geometry";

export interface ElementLayoutServiceState {
  elementPositionsById: Record<string, Point>;
  wireJointIdsByConnectionId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: ElementLayoutServiceState = {
  elementPositionsById: {},
  wireJointIdsByConnectionId: {},
  wireJointPositionsByJointId: {},
};

export const defaultElementLayoutServiceState: Readonly<ElementLayoutServiceState> = Object.freeze(
  _defaultState
);
