import { Point, snapPoint } from "@/geometry";
import { AppState } from "@/store";

import { createCircuitEditorDragSelector } from "../utils";

export const gridElementSnapSelector = createCircuitEditorDragSelector(
  () => 50
);

export const gridJointSnapSelector = createCircuitEditorDragSelector(() => 5);

export const applyGridElementSnapSelector = (s: AppState, p: Point) => {
  const snap = gridElementSnapSelector(s);
  return snapPoint(p, snap);
};

export const applyGridJointSnapSelector = (s: AppState, p: Point) => {
  const snap = gridJointSnapSelector(s);
  return snapPoint(p, snap);
};
