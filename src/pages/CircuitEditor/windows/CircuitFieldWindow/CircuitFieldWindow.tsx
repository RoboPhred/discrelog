import * as React from "react";
import { useDispatch } from "react-redux";
import { HotKeys } from "react-hotkeys";
import { AnyAction } from "redux";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";

import { tickSim } from "@/actions/sim-tick";
import { fastForwardSim } from "@/actions/sim-fastforward";
import { paste } from "@/actions/clipboard-paste";
import { copySelection } from "@/actions/selection-copy";
import { deleteSelection } from "@/actions/selection-delete";
import { selectAll } from "@/actions/select-all";
import { undo } from "@/actions/undo";
import { redo } from "@/actions/redo";

import CircuitField from "@/components/CircuitField";

import keymap, {
  KeymapHandler,
  KEYMAP_SIM_STEP,
  KEYMAP_SIM_FASTFORWARD,
  KEYMAP_COPY,
  KEYMAP_PASTE,
  KEYMAP_DELETE,
  KEYMAP_SELECT_ALL,
  KEYMAP_UNDO,
  KEYMAP_REDO,
} from "./keymap";

import { WindowProps } from "../window-props";

import styles from "./CircuitFieldWindow.module.css";

const CircuitFieldWindow: React.FC<WindowProps> = ({ className }) => {
  const dispatch = useDispatch();

  const keyHandlers = React.useMemo(() => {
    function createEventDispatcher(action: AnyAction): HotkeyHandler {
      return (e?: KeyboardEvent) => {
        if (e) {
          if (e.defaultPrevented) {
            return;
          }
          e.preventDefault();
        }
        dispatch(action);
      };
    }
    const keyHandlers: KeymapHandler = {
      [KEYMAP_SIM_STEP]: createEventDispatcher(tickSim(1)),
      [KEYMAP_SIM_FASTFORWARD]: createEventDispatcher(fastForwardSim()),
      [KEYMAP_SELECT_ALL]: createEventDispatcher(selectAll()),
      [KEYMAP_COPY]: createEventDispatcher(copySelection()),
      [KEYMAP_PASTE]: createEventDispatcher(paste()),
      [KEYMAP_DELETE]: createEventDispatcher(deleteSelection()),
      [KEYMAP_UNDO]: createEventDispatcher(undo()),
      [KEYMAP_REDO]: createEventDispatcher(redo()),
    };
    return keyHandlers;
  }, [dispatch]);

  return (
    <div
      className={cls(
        "circuit-field-view",
        styles["circuit-field-view"],
        className
      )}
    >
      <HotKeys keyMap={keymap} handlers={keyHandlers} component={FillParent}>
        <CircuitField className={sizing["fill-parent"]} />
      </HotKeys>
    </div>
  );
};

const FillParent: React.FC = ({ children, ...props }) => {
  return (
    <div {...props} className={sizing["fill-parent"]}>
      {children}
    </div>
  );
};

export default CircuitFieldWindow;
