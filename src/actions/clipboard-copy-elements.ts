import { AnyAction } from "redux";

export const ACTION_COPY_ELEMENTS = "@clipboard/copy-elements" as const;
export const copyElements = (elementId: string | string[]) => ({
  type: ACTION_COPY_ELEMENTS,
  payload: {
    elementIds: Array.isArray(elementId) ? elementId : [elementId],
  },
});
export type CopyElementsAction = ReturnType<typeof copyElements>;
export function isCopyElementsAction(
  action: AnyAction
): action is CopyElementsAction {
  return action.type === ACTION_COPY_ELEMENTS;
}
