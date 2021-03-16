import { Point, snapPoint } from "@/geometry";
import { AppState } from "@/store";

import { createCircuitEditorDragSelector } from "../utils";

export const gridNodeSnapSelector = createCircuitEditorDragSelector(() => 50);

export const gridJointSnapSelector = createCircuitEditorDragSelector(() => 5);

export const applyGridNodeSnapSelector = (s: AppState, p: Point) => {
  const snap = gridNodeSnapSelector(s);
  return snapPoint(p, snap);
};

export const applyGridJointSnapSelector = (s: AppState, p: Point) => {
  const snap = gridJointSnapSelector(s);
  return snapPoint(p, snap);
};
