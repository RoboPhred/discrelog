import { IDMap, Point } from "@/types";

export interface FieldState {
  nodePositionsById: IDMap<Point>;
}

export const defaultFieldState: Readonly<FieldState> = Object.freeze({
  nodePositionsById: {}
});
