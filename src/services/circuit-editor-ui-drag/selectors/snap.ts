import { Point } from "@/geometry";
import { AppState } from "@/store";
import { createCircuitEditorUiDragSelector } from "../utils";

export const gridNodeSnapSelector = createCircuitEditorUiDragSelector(() => 50);

export const gridJointSnapSelector = createCircuitEditorUiDragSelector(() => 5);

export const applyGridNodeSnapSelector = (s: AppState, p: Point) => {
  const snap = gridNodeSnapSelector(s);
  return {
    x: Math.round(p.x / snap) * snap,
    y: Math.round(p.y / snap) * snap,
  };
};

export const applyGridJointSnapSelector = (s: AppState, p: Point) => {
  const snap = gridJointSnapSelector(s);
  return {
    x: Math.round(p.x / snap) * snap,
    y: Math.round(p.y / snap) * snap,
  };
};
