import * as React from "react";

export interface PopoverChildContext {
  registerPopoverChild(element: HTMLElement): void;
  unregisterPopoverChild(element: HTMLElement): void;
}

function noop() {
  // no op.
}
const noopPopoverChildContext: PopoverChildContext = {
  registerPopoverChild: noop,
  unregisterPopoverChild: noop,
};

export const PopoverChildContext = React.createContext<PopoverChildContext | null>(
  null
);

export const usePopoverChildContext = () =>
  React.useContext(PopoverChildContext);

export const PopoverChildContextProvider: React.FC<PopoverChildContext> = ({
  registerPopoverChild: contextRegister,
  unregisterPopoverChild: contextUnregister,
  children,
}) => {
  const parent = usePopoverChildContext();
  const parentRegister = parent?.registerPopoverChild;
  const parentUnregister = parent?.unregisterPopoverChild;

  const registerPopoverChild = React.useCallback(
    (element: HTMLElement) => {
      if (parentRegister) {
        parentRegister(element);
      }
      contextRegister(element);
    },
    [contextRegister, parentRegister]
  );

  const unregisterPopoverChild = React.useCallback(
    (element: HTMLElement) => {
      contextUnregister(element);
      if (parentUnregister) {
        parentUnregister;
      }
    },
    [contextUnregister, parentUnregister]
  );

  const providedContext = React.useMemo(
    () => ({
      registerPopoverChild,
      unregisterPopoverChild,
    }),
    [registerPopoverChild, unregisterPopoverChild]
  );

  return (
    <PopoverChildContext.Provider value={providedContext}>
      {children}
    </PopoverChildContext.Provider>
  );
};

export function usePopoverChild(element: HTMLElement | null) {
  const popoverContext =
    React.useContext(PopoverChildContext) ?? noopPopoverChildContext;

  // We do not want to trigger the effect when
  //  the context changes, as the context will change
  //  as a result of calling register and unregister.
  // As a result, we will not function right if somehow our
  //  element transfers to a different popup chain without re-rendering.
  const ctxRef = React.useRef(popoverContext);
  React.useEffect(() => {
    ctxRef.current = popoverContext;
  });

  React.useEffect(() => {
    if (element) {
      ctxRef.current.registerPopoverChild(element);
      return () => ctxRef.current.unregisterPopoverChild(element);
    }
  }, [element]);
}
