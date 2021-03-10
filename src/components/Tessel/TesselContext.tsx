import * as React from "react";
import { TesselDropPosition } from "./types";

const tesselPathContext = React.createContext<string[]>([]);
export function useTesselPath() {
  return React.useContext(tesselPathContext);
}
export interface TesselContextProviderProps {
  pathKey: string;
}
export const TesselPathProvider: React.FC<TesselContextProviderProps> = ({
  pathKey,
  children,
}) => {
  const path = useTesselPath();

  const newPath = React.useMemo<string[]>(() => [...path, pathKey], [
    path,
    pathKey,
  ]);

  return (
    <tesselPathContext.Provider value={newPath}>
      {children}
    </tesselPathContext.Provider>
  );
};

export interface TesselInteractionContext {
  moveWindow(from: string[], to: string[], position: TesselDropPosition): void;
  closeWindow(path: string[]): void;
}
function noop() {
  /* no op */
}
const tesselInteractionContext = React.createContext<TesselInteractionContext>({
  moveWindow: noop,
  closeWindow: noop,
});
export function useTesselInteraction() {
  return React.useContext(tesselInteractionContext);
}

export type TesselInteractionProviderProps = TesselInteractionContext;
export const TesselInteractionProvider: React.FC<TesselInteractionProviderProps> = ({
  moveWindow,
  closeWindow,
  children,
}) => {
  const context = React.useMemo<TesselInteractionContext>(
    () => ({
      moveWindow,
      closeWindow,
    }),
    [moveWindow, closeWindow]
  );

  return (
    <tesselInteractionContext.Provider value={context}>
      {children}
    </tesselInteractionContext.Provider>
  );
};
