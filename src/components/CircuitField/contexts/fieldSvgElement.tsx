import * as React from "react";

export const fieldSvgElementContext = React.createContext<
  React.RefObject<SVGSVGElement | null>
>({ current: null });

const ContextProvider = fieldSvgElementContext.Provider;

export const FieldSvgElementProvider: React.FC<{
  value: React.RefObject<SVGSVGElement | null>;
}> = ({ value, children }) => {
  return <ContextProvider value={value}>{children}</ContextProvider>;
};
