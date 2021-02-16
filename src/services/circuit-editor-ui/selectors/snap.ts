import { Point } from "@/geometry";
import { AppState } from "@/store";
import { createCircuitEditorUiSelector } from "../utils";

export const gridSnapSelector = createCircuitEditorUiSelector((s) => 50);

export const gridSnapPointSelector = (state: AppState) => {
  const snap = gridSnapSelector(state);
  return {
    x: snap,
    y: snap,
  };
};

export const applyGridSnapSelector = (s: AppState, p: Point) => {
  const snap = gridSnapSelector(s);
  return {
    x: Math.round(p.x / snap) * snap,
    y: Math.round(p.y / snap) * snap,
  };
};
