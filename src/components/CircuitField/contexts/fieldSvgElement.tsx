import * as React from "react";

export interface FieldSvgElementContext {
  svgRef: React.RefObject<SVGSVGElement | null>;
  scalerRef: React.RefObject<SVGGraphicsElement | null>;
}
const nullRef = { current: null };
export const fieldSvgElementContext = React.createContext<
  FieldSvgElementContext
>({ svgRef: nullRef, scalerRef: nullRef });

const ContextProvider = fieldSvgElementContext.Provider;

export const FieldSvgElementProvider: React.FC<{
  svgRef: React.RefObject<SVGSVGElement | null>;
  scalerRef: React.RefObject<SVGGraphicsElement | null>;
}> = ({ svgRef, scalerRef, children }) => {
  const context = React.useMemo(
    () => ({
      svgRef,
      scalerRef,
    }),
    [svgRef, scalerRef]
  );
  return <ContextProvider value={context}>{children}</ContextProvider>;
};
