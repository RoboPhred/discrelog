import * as React from "react";

export const fieldSvgElementContext = React.createContext<SVGSVGElement | null>(
  null
);

const ContextProvider = fieldSvgElementContext.Provider;

export const FieldSvgElementProvider: React.FC<{
  value: React.RefObject<SVGSVGElement | null>;
}> = ({ value, children }) => {
  // Force the component to rerender when the ref changes.
  const [svgElement, setSvgElement] = React.useState<SVGSVGElement | null>(
    null
  );
  React.useEffect(() => {
    setSvgElement(value.current);
  }, [value.current]);

  return <ContextProvider value={svgElement}>{children}</ContextProvider>;
};
