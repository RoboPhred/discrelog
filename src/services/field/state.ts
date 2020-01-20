import { IDMap, Point } from "@/types";

export interface FieldState {
  width: number;
  height: number;
  nodePositionsById: IDMap<Point>;
  wireJointIdsByWireId: IDMap<string[]>;
  wireJointPositionsByJointId: IDMap<Point>;
  dragMode: "move" | "select" | null;
  dragStart: Point | null;
  dragEnd: Point | null;
}

const _defaultState: FieldState = {
  width: 1024,
  height: 768,
  nodePositionsById: {},
  wireJointIdsByWireId: {},
  wireJointPositionsByJointId: {},
  dragMode: null,
  dragStart: null,
  dragEnd: null
};

export const defaultFieldState: Readonly<FieldState> = Object.freeze(
  _defaultState
);
