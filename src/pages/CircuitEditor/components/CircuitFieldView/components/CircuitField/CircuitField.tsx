import * as React from "react";

import sizing from "@/styles/sizing.module.css";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragPreviewLayer from "./components/DragPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

export interface CircuitFieldProps {}

const CircuitField: React.FC<CircuitFieldProps> = ({}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const onMouseDown = React.useCallback(() => {
    svgRef.current?.focus();
  }, []);

  return (
    <svg
      className={sizing["fill-parent"]}
      tabIndex={-1}
      ref={svgRef}
      onMouseDown={onMouseDown}
    >
      <FieldSvgElementProvider value={svgRef}>
        <DragSelectLayer />
        <DragPreviewLayer />
        <WiresLayer />
        <NodesLayer />
      </FieldSvgElementProvider>
    </svg>
  );
};

export default CircuitField;
