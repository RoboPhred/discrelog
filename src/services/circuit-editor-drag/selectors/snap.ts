import { Point, snapPoint } from "@/geometry";
import { AppState } from "@/store";

import { createCircuitEditorUiDragSelector } from "../utils";

export const gridNodeSnapSelector = createCircuitEditorUiDragSelector(() => 50);

export const gridJointSnapSelector = createCircuitEditorUiDragSelector(() => 5);

export const applyGridNodeSnapSelector = (s: AppState, p: Point) => {
  const snap = gridNodeSnapSelector(s);
  return snapPoint(p, snap);
};

export const applyGridJointSnapSelector = (s: AppState, p: Point) => {
  const snap = gridJointSnapSelector(s);
  return snapPoint(p, snap);
};
