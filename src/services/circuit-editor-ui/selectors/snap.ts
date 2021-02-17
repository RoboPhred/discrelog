import { Point } from "@/geometry";
import { AppState } from "@/store";
import { createCircuitEditorUiSelector } from "../utils";

export const gridNodeSnapSelector = createCircuitEditorUiSelector(() => 50);

export const gridJointSnapSelector = createCircuitEditorUiSelector(() => 5);

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
