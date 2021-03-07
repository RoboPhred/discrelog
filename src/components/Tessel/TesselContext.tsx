import * as React from "react";

const tesselPathContext = React.createContext<string[]>([]);

export function useTesselPath() {
  return React.useContext(tesselPathContext);
}

export interface TesselContextProviderProps {
  pathKey: string;
}
const TesselPathProvider: React.FC<TesselContextProviderProps> = ({
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

export default TesselPathProvider;
