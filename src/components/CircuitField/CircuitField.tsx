import * as React from "react";

import { cls } from "@/utils";
import { calcSize } from "@/geometry";

import useSelector from "@/hooks/useSelector";
import { useNativeEvent } from "@/hooks/useNativeEvent";
import { useComponentBounds } from "@/hooks/useComponentBounds";

import { fieldRectSelector } from "@/services/node-layout/selectors/field";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import { useContextMenu } from "@/components/ContextMenu";

import FieldContextMenu from "./components/FieldContextMenu";
import CircuitFieldSurface from "./components/CircuitFieldSurface";

import { CircuitFieldProvider } from "./circuit-field-context";

import styles from "./CircuitField.module.css";
import {
  useViewportContext,
  ViewportContextProvider,
} from "./viewport-context";

export interface CircuitFieldProps {
  className?: string;
  circuitId: string;
  circuitNodePath: string[];
}

const CircuitField: React.FC<CircuitFieldProps> = ({
  className,
  circuitId,
  circuitNodePath,
}) => {
  const isSimActive = useSelector(isSimActiveSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  // svg seems to have an implicit bottom margin against its parent div
  // Wrapping it in a div of the same size fixes it.
  return (
    <CircuitFieldProvider
      circuitId={circuitId}
      circuitNodePath={circuitNodePath}
    >
      <div
        className={cls(
          "circuit-field",
          styles["circuit-field"],
          isSimActive && "simulator-active",
          className
        )}
      >
        <div className={styles["circuit-field-scrollarea"]}>
          <ViewportContextProvider>
            <ZoomingCircuitFieldSurface onContextMenu={openContextMenu} />
          </ViewportContextProvider>
        </div>
        {renderContextMenu(<FieldContextMenu />)}
      </div>
    </CircuitFieldProvider>
  );
};

interface ZoomingCircuitFieldSurface {
  onContextMenu(e: React.MouseEvent): void;
}
const ZoomingCircuitFieldSurface: React.FC<ZoomingCircuitFieldSurface> = ({
  onContextMenu,
}) => {
  const sizeRef = React.useRef<HTMLDivElement | null>(null);
  const { width: componentWidth, height: componentHeight } = useComponentBounds(
    sizeRef
  );

  const { zoomFactor, zoom } = useViewportContext();

  const fieldRect = useSelector(fieldRectSelector);
  const { width: fieldWidth, height: fieldHeight } = calcSize(fieldRect);

  const width = Math.max(componentWidth, fieldWidth * zoomFactor);
  const height = Math.max(componentHeight, fieldHeight * zoomFactor);

  const onWheel = React.useCallback(
    (e: WheelEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      if (e.ctrlKey) {
        zoom(e.deltaY > 0 ? -1 : 1);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [zoom]
  );

  // React listens to the root listener for all events,
  //  and chrome assumes the root event listener for mouse events
  //  never wants to preventDefault.
  // We need to take a local event listener and mark it as not passive.
  // https://github.com/facebook/react/issues/14856
  useNativeEvent(sizeRef, "wheel", onWheel, { passive: false });

  return (
    <div ref={sizeRef} style={{ width: "100%", height: "100%" }}>
      <CircuitFieldSurface
        width={width}
        height={height}
        onContextMenu={onContextMenu}
      />
    </div>
  );
};

export default CircuitField;