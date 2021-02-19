import * as React from "react";
import { useDispatch } from "react-redux";
import { ContextMenu } from "@blueprintjs/core";
import useComponentSize from "@rehooks/component-size";

import { cls } from "@/utils";
import { calcSize } from "@/geometry";

import useSelector from "@/hooks/useSelector";
import { useNativeEvent } from "@/hooks/useNativeEvent";

import { fieldRectSelector } from "@/services/node-layout/selectors/field";
import { viewScaleSelector } from "@/services/circuit-editor-view/selectors/view";

import { fieldMouseLeave } from "@/actions/field-mouse-leave";
import { viewZoom } from "@/actions/view-zoom";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragNewNodeLayer from "./components/DragNewNodeLayer";
import DragNodePreviewLayer from "./components/DragNodePreviewLayer";
import DragJointPreviewLayer from "./components/DragJointPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import GridBackground from "./components/GridBackground";
import NodesLayer from "./components/NodesLayer";
import WiresLayer from "./components/WiresLayer";
import NodePinsLayer from "./components/NodePinsLayer";
import DragAttachWirePreviewLayer from "./components/DragAttachWirePreviewLayer";
import FieldContextMenu from "./components/FieldContextMenu";

import styles from "./CircuitField.module.css";

export interface CircuitFieldProps {
  className?: string;
}

const CircuitField: React.FC<CircuitFieldProps> = ({ className }) => {
  const dispatch = useDispatch();

  const ref = React.useRef<HTMLDivElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const scalerRef = React.useRef<SVGGElement>(null);

  const { width: componentWidth, height: componentHeight } = useComponentSize(
    ref
  );

  const fieldRect = useSelector(fieldRectSelector);
  const { width: fieldWidth, height: fieldHeight } = calcSize(fieldRect);

  const viewScale = useSelector(viewScaleSelector);

  const width = Math.max(componentWidth, fieldWidth * viewScale);
  const height = Math.max(componentHeight, fieldHeight * viewScale);

  const onMouseDown = React.useCallback(() => {
    svgRef.current?.focus();
  }, []);

  const onMouseLeave = React.useCallback(() => {
    dispatch(fieldMouseLeave());
  }, [dispatch]);

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      ContextMenu.show(<FieldContextMenu dispatch={dispatch} />, {
        left: e.pageX,
        top: e.pageY,
      });
    },
    [dispatch]
  );

  const onWheel = React.useCallback(
    (e: WheelEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      if (e.ctrlKey) {
        dispatch(viewZoom(e.deltaY > 0 ? -1 : 1));
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [dispatch]
  );

  // React listens to the root listener for all events,
  //  and chrome assumes the root event listener for mouse events
  //  never wants to preventDefault.
  // We need to take a local event listener and mark it as not passive.
  // https://github.com/facebook/react/issues/14856
  useNativeEvent(ref, "wheel", onWheel, { passive: false });

  return (
    // svg seems to have an implicit bottom margin against its parent div.
    //  Wrapping it in a div of the same size fixes it.
    <div className={cls("circuit-field", styles["circuit-editor"], className)}>
      <div ref={ref} className={styles["circuit-editor-scrollarea"]}>
        <svg
          tabIndex={-1}
          className={styles["circuit-editor-svg-field"]}
          ref={svgRef}
          width={width}
          height={height}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onContextMenu={onContextMenu}
        >
          <GridBackground />
          <g
            ref={scalerRef}
            transform-origin="0 0"
            transform={`scale(${viewScale})`}
          >
            <FieldSvgElementProvider svgRef={svgRef} scalerRef={scalerRef}>
              <DragSelectLayer />
              <NodesLayer />
              <WiresLayer />
              <NodePinsLayer />
              <DragAttachWirePreviewLayer />
              <DragNodePreviewLayer />
              <DragJointPreviewLayer />
              <DragNewNodeLayer />
            </FieldSvgElementProvider>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default CircuitField;
