import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { calcSize } from "@/geometry";

import useSelector from "@/hooks/useSelector";
import { useNativeEvent } from "@/hooks/useNativeEvent";
import { useComponentBounds } from "@/hooks/useComponentBounds";

import { fieldRectSelector } from "@/services/node-layout/selectors/field";
import { viewScaleSelector } from "@/services/circuit-editor-ui-viewport/selectors/view";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import { viewZoom } from "@/actions/view-zoom";

import { useContextMenu } from "@/components/ContextMenu";

import FieldContextMenu from "./components/FieldContextMenu";
import CircuitFieldSvg from "./components/CircuitFieldSurface";

import { CircuitFieldProvider } from "./circuit-field-context";

import styles from "./CircuitField.module.css";

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
  const dispatch = useDispatch();

  const sizeRef = React.useRef<HTMLDivElement | null>(null);
  const isSimActive = useSelector(isSimActiveSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const { width: componentWidth, height: componentHeight } = useComponentBounds(
    sizeRef
  );

  const fieldRect = useSelector(fieldRectSelector);
  const { width: fieldWidth, height: fieldHeight } = calcSize(fieldRect);

  const viewScale = useSelector(viewScaleSelector);

  const width = Math.max(componentWidth, fieldWidth * viewScale);
  const height = Math.max(componentHeight, fieldHeight * viewScale);

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
          <div ref={sizeRef} style={{ width: "100%", height: "100%" }}>
            <CircuitFieldSvg
              width={width}
              height={height}
              onContextMenu={openContextMenu}
            />
          </div>
        </div>
        {renderContextMenu(<FieldContextMenu />)}
      </div>
    </CircuitFieldProvider>
  );
};

export default CircuitField;
