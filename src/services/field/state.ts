import { Point } from "@/geometry";
import { ElementType } from "@/element-defs";

export interface FieldState {
  nodePositionsById: Record<string, Point>;
  wireJointIdsByWireId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
  dragMode: "move" | "select" | "new-element" | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  dragNewElementType: ElementType | null;
}

const _defaultState: FieldState = {
  nodePositionsById: {},
  wireJointIdsByWireId: {},
  wireJointPositionsByJointId: {},
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  dragNewElementType: null,
};

export const defaultFieldState: Readonly<FieldState> = Object.freeze(
  _defaultState
);
