import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";
import {
  fieldWidthSelector,
  fieldHeightSelector,
} from "@/services/field/selectors/bounds";

import { fieldMouseLeave } from "@/actions/field-mouse-leave";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragNewNodeLayer from "./components/DragNewNodeLayer";
import DragPreviewLayer from "./components/DragPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import NodesLayer from "./components/NodesLayer";
import WiresLayer from "./components/WiresLayer";
import NodePinsLayer from "./components/NodePinsLayer";

import styles from "./CircuitField.module.css";

const CircuitField: React.FC = () => {
  const dispatch = useDispatch();
  const width = useSelector(fieldWidthSelector);
  const height = useSelector(fieldHeightSelector);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const onMouseDown = React.useCallback(() => {
    svgRef.current?.focus();
  }, []);

  const onMouseLeave = React.useCallback(() => {
    dispatch(fieldMouseLeave());
  }, []);

  return (
    // svg seems to have an implicit bottom margin against its parent div.
    //  Wrapping it in a div of the same size fixes it.
    <div
      className={cls("circuit-field", styles["circuit-editor"])}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg
        tabIndex={-1}
        ref={svgRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
      >
        <FieldSvgElementProvider value={svgRef}>
          <DragSelectLayer />
          <NodesLayer />
          <WiresLayer />
          <NodePinsLayer />
          <DragPreviewLayer />
          <DragNewNodeLayer />
        </FieldSvgElementProvider>
      </svg>
    </div>
  );
};

export default CircuitField;
