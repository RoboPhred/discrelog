import * as React from "react";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

export function useAction(actionCreator: () => AnyAction): () => AnyAction;
export function useAction<Args>(
  actionCreator: (...args: Args[]) => AnyAction
): (...args: Args[]) => AnyAction;
export function useAction<A0, Args>(
  actionCreator: (a0: A0, ...args: Args[]) => AnyAction,
  a0: A0
): (...args: Args[]) => AnyAction;
export function useAction(
  actionCreator: (...args: any[]) => AnyAction,
  ...preBind: any[]
): (...args: any[]) => AnyAction {
  const dispatch = useDispatch();
  return React.useCallback(
    (...args: any[]) => {
      const action = actionCreator(...[...preBind, ...args]);
      if (action) {
        dispatch(action);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, actionCreator, ...preBind]
  ) as any;
}
