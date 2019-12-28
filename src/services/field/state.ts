import { IDMap, Point } from "@/types";

export interface FieldState {
  nodePositionsById: IDMap<Point>;
  wireJointsByWireId: IDMap<Point[]>;
}

const _defaultState: FieldState = {
  nodePositionsById: {},
  wireJointsByWireId: {}
};

export const defaultFieldState: Readonly<FieldState> = Object.freeze(
  _defaultState
);
