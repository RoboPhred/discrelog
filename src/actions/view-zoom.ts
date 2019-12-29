import { AnyAction } from "redux";

export const ACTION_VIEW_ZOOM = "@view/zoom" as const;
export const viewZoom = (delta: number) => ({
  type: ACTION_VIEW_ZOOM,
  payload: { delta }
});
export type ViewZoomAction = ReturnType<typeof viewZoom>;
export function isViewZoomAction(action: AnyAction): action is ViewZoomAction {
  return action.type === ACTION_VIEW_ZOOM;
}
