import * as React from "react";
import { useDispatch } from "react-redux";
import useComponentSize from "@rehooks/component-size";

import { cls } from "@/utils";
import { calcSize } from "@/geometry";

import useSelector from "@/hooks/useSelector";
import { useNativeEvent } from "@/hooks/useNativeEvent";

import { fieldRectSelector } from "@/services/node-layout/selectors/field";
import { viewScaleSelector } from "@/services/circuit-editor-ui-viewport/selectors/view";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import { fieldMouseLeave } from "@/actions/field-mouse-leave";
import { viewZoom } from "@/actions/view-zoom";

import { useContextMenu } from "@/components/ContextMenu";

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

  const sizeRef = React.useRef<HTMLDivElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const scalerRef = React.useRef<SVGGElement>(null);

  const isSimActive = useSelector(isSimActiveSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const { width: componentWidth, height: componentHeight } = useComponentSize(
    sizeRef
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
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      openContextMenu(e);
    },
    [openContextMenu]
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
  useNativeEvent(sizeRef, "wheel", onWheel, { passive: false });

  return (
    // svg seems to have an implicit bottom margin against its parent div.
    //  Wrapping it in a div of the same size fixes it.
    <div className={cls("circuit-field", styles["circuit-field"], className)}>
      <div className={styles["circuit-field-scrollarea"]}>
        <div ref={sizeRef} style={{ width: "100%", height: "100%" }}>
          <svg
            tabIndex={-1}
            ref={svgRef}
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
            className={cls(isSimActive && "simulator-active")}
          >
            <GridBackground />
            <g
              ref={scalerRef}
              transform-origin="0 0"
              transform={`scale(${viewScale})`}
            >
              <FieldSvgElementProvider svgRef={svgRef} scalerRef={scalerRef}>
                <DragNewNodeLayer />
                <DragSelectLayer />
                <NodesLayer />
                <WiresLayer />
                <NodePinsLayer />
                <DragAttachWirePreviewLayer />
                <DragNodePreviewLayer />
                <DragJointPreviewLayer />
              </FieldSvgElementProvider>
            </g>
          </svg>
        </div>
      </div>
      {renderContextMenu(<FieldContextMenu />)}
    </div>
  );
};

export default CircuitField;
