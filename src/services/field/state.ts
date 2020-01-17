import { IDMap, Point } from "@/types";

export interface FieldState {
  width: number;
  height: number;
  nodePositionsById: IDMap<Point>;
  wireJointIdsByWireId: IDMap<string[]>;
  wireJointPositionsByJointId: IDMap<Point>;
}

const _defaultState: FieldState = {
  width: 1024,
  height: 768,
  nodePositionsById: {},
  wireJointIdsByWireId: {},
  wireJointPositionsByJointId: {}
};

export const defaultFieldState: Readonly<FieldState> = Object.freeze(
  _defaultState
);
