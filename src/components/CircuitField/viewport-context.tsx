import * as React from "react";

export interface ViewportContext {
  zoomFactor: number;
  zoom(factor: number): void;
}

const viewportContext = React.createContext<ViewportContext>({
  zoomFactor: 1,
  zoom: () => {
    /* no op */
  },
});

export function useViewportContext(): ViewportContext {
  return React.useContext(viewportContext);
}

const SCALE_FACTOR = 1.03;

export const ViewportContextProvider: React.FC = ({ children }) => {
  const [zoomFactor, setZoomFactor] = React.useState(1);
  const zoom = React.useCallback((delta: number) => {
    setZoomFactor((zoomFactor) =>
      delta > 0
        ? zoomFactor * delta * SCALE_FACTOR
        : zoomFactor / (-delta * SCALE_FACTOR)
    );
  }, []);

  const context = React.useMemo<ViewportContext>(
    () => ({
      zoomFactor,
      zoom,
    }),
    [zoom, zoomFactor]
  );
  return (
    <viewportContext.Provider value={context}>
      {children}
    </viewportContext.Provider>
  );
};
