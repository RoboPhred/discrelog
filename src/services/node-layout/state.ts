import { Point } from "@/geometry";

export interface FieldState {
  nodePositionsById: Record<string, Point>;
  wireJointIdsByWireId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: FieldState = {
  nodePositionsById: {},
  wireJointIdsByWireId: {},
  wireJointPositionsByJointId: {},
};

export const defaultFieldState: Readonly<FieldState> = Object.freeze(
  _defaultState
);
