import { IDMap, Point } from "@/types";
import { ElementType } from "@/element-defs";

export interface FieldState {
  nodePositionsById: IDMap<Point>;
  wireJointIdsByWireId: IDMap<string[]>;
  wireJointPositionsByJointId: IDMap<Point>;
  dragMode: "move" | "select" | "new-node" | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  dragNewNodeType: ElementType | null;
}

const _defaultState: FieldState = {
  nodePositionsById: {},
  wireJointIdsByWireId: {},
  wireJointPositionsByJointId: {},
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  dragNewNodeType: null,
};

export const defaultFieldState: Readonly<FieldState> = Object.freeze(
  _defaultState
);
