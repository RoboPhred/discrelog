import { AnyAction } from "redux";

export const ACTION_SELECTION_ALIGN_TO_GRID = "@selection/align-to-grid" as const;
export const alignSelectionToGrid = () => ({
  type: ACTION_SELECTION_ALIGN_TO_GRID,
});
export function isAlignSelectionToGridAction(action: AnyAction): boolean {
  return action.type === ACTION_SELECTION_ALIGN_TO_GRID;
}
