import * as React from "react";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

export function useAction<T extends (...args: any[]) => AnyAction>(
  actionCreator: T
): T {
  const dispatch = useDispatch();
  return React.useCallback((...args: any[]) => {
    dispatch(actionCreator(...args));
  }, []) as any;
}
