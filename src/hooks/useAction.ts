import * as React from "react";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

export function useAction(actionCreator: () => AnyAction): () => AnyAction;
export function useAction<Args>(
  actionCreator: (...args: Args[]) => AnyAction
): () => AnyAction;
export function useAction<A0, Args>(
  actionCreator: (a0: A0, ...args: Args[]) => AnyAction,
  a0: A0
): () => AnyAction;
export function useAction(
  actionCreator: (...args: any[]) => AnyAction,
  ...preBind: any[]
): () => AnyAction {
  const dispatch = useDispatch();
  return React.useCallback(
    () => {
      const action = actionCreator(...preBind);
      if (action) {
        dispatch(action);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, actionCreator, ...preBind]
  ) as any;
}

export function useClickAction(
  actionCreator: (...args: any[]) => AnyAction,
  ...preBind: any[]
): (e: React.MouseEvent) => AnyAction {
  const dispatch = useDispatch();
  return React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      const action = actionCreator(...preBind);
      if (action) {
        dispatch(action);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, actionCreator, ...preBind]
  ) as any;
}
