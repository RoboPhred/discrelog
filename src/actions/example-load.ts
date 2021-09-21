import { AnyAction } from "redux";

export const ACTION_EXAMPLE_LOAD = "@example/load" as const;
export const loadExample = (exampleKey: string) => ({
  type: ACTION_EXAMPLE_LOAD,
  payload: { exampleKey },
});
export type LoadExampleAction = ReturnType<typeof loadExample>;
export function isLoadExampleAction(
  action: AnyAction
): action is LoadExampleAction {
  return action.type === ACTION_EXAMPLE_LOAD;
}
