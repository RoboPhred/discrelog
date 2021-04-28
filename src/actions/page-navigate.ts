import { AnyAction } from "redux";

export const ACTION_PAGE_NAVIGATE = "@page/navigate" as const;
export const navigatePage = (page: string) => ({
  type: ACTION_PAGE_NAVIGATE,
  payload: { page },
});
export type PageNavigateAction = ReturnType<typeof navigatePage>;
export function isPageNavigateAction(
  action: AnyAction
): action is PageNavigateAction {
  return action.type === ACTION_PAGE_NAVIGATE;
}
