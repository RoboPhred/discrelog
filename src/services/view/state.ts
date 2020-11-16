import { ElementType } from "@/element-defs";
import { Point } from "@/geometry";

export interface ViewState {
  scale: number;
  dragMode: "move" | "select" | "new-element" | null;
  dragStart: Point | null;
  dragEnd: Point | null;
  dragNewElementType: ElementType | null;
}

const _defaultState: ViewState = {
  scale: 1,
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  dragNewElementType: null,
};

export const defaultViewState = Object.freeze(_defaultState);
