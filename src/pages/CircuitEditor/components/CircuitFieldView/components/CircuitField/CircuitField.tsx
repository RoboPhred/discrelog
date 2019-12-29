import * as React from "react";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";
import {
  fieldWidthSelector,
  fieldHeightSelector
} from "@/services/field/selectors/bounds";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragPreviewLayer from "./components/DragPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

import styles from "./CircuitField.module.css";

export interface CircuitFieldProps {}

const CircuitField: React.FC<CircuitFieldProps> = ({}) => {
  const width = useSelector(fieldWidthSelector);
  const height = useSelector(fieldHeightSelector);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const onMouseDown = React.useCallback(() => {
    svgRef.current?.focus();
  }, []);

  return (
    // svg seems to have an implicit bottom margin against its parent div.
    //  Wrapping it in a div of the same size fixes it.
    <div
      className={cls("circuit-field", styles["circuit-editor"])}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        tabIndex={-1}
        ref={svgRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
      >
        <FieldSvgElementProvider value={svgRef}>
          <DragSelectLayer />
          <DragPreviewLayer />
          <WiresLayer />
          <NodesLayer />
        </FieldSvgElementProvider>
      </svg>
    </div>
  );
};

export default CircuitField;
