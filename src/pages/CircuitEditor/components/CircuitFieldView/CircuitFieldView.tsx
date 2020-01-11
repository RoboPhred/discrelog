import * as React from "react";
import { useDispatch } from "react-redux";
import { HotKeys } from "react-hotkeys";

import { cls } from "@/utils";
import { useNativeEvent } from "@/hooks/useNativeEvent";
import useSelector from "@/hooks/useSelector";

import { viewScaleSelector } from "@/services/view/selectors/view";

import { viewZoom } from "@/actions/view-zoom";
import { tickSim } from "@/actions/sim-tick";
import { fastForwardSim } from "@/actions/sim-fastforward";
import { paste } from "@/actions/clipboard-paste";
import { selectionCopy } from "@/actions/selection-copy";
import { selectionDelete } from "@/actions/selection-delete";

import keymap, {
  KeymapHandler,
  KEYMAP_SIM_STEP,
  KEYMAP_SIM_FASTFORWARD,
  KEYMAP_NODE_COPY,
  KEYMAP_NODE_PASTE,
  KEYMAP_NODE_DELETE
} from "./keymap";

import CircuitField from "./components/CircuitField";

import styles from "./CircuitFieldView.module.css";

export interface CircuitFieldViewProps {
  className?: string;
}

const CircuitFieldView: React.FC<CircuitFieldViewProps> = ({ className }) => {
  const viewRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const scale = useSelector(viewScaleSelector);

  const keyHandlers = React.useMemo(() => {
    let keyHandlers: KeymapHandler = {
      [KEYMAP_SIM_STEP]: () => dispatch(tickSim(1)),
      [KEYMAP_SIM_FASTFORWARD]: () => dispatch(fastForwardSim()),
      [KEYMAP_NODE_COPY]: () => dispatch(selectionCopy()),
      [KEYMAP_NODE_PASTE]: () => dispatch(paste()),
      [KEYMAP_NODE_DELETE]: () => dispatch(selectionDelete())
    };
    return keyHandlers;
  }, [dispatch]);

  const onWheel = React.useCallback((e: WheelEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (e.ctrlKey) {
      dispatch(viewZoom(e.deltaY > 0 ? -1 : 1));
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // React listens to the root listener for all events,
  //  and chrome assumes the root event listener for mouse events
  //  never wants to preventDefault.
  // We need to take a local event listener and mark it as not passive.
  // https://github.com/facebook/react/issues/14856
  useNativeEvent(viewRef, "wheel", onWheel, { passive: false });

  return (
    <div
      className={cls(
        "circuit-field-view",
        className,
        styles["circuit-field-view"]
      )}
      style={{ position: "relative", width: "1024px", height: "768px" }}
      ref={viewRef}
    >
      <div
        className="zoom-container"
        style={{
          position: "absolute",
          transform: `scale(${scale})`,
          transformOrigin: "0 0"
        }}
      >
        <HotKeys keyMap={keymap} handlers={keyHandlers}>
          <CircuitField />
        </HotKeys>
      </div>
    </div>
  );
};

export default CircuitFieldView;
