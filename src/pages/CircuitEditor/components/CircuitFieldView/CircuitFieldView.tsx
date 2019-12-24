import * as React from "react";
import { useDispatch } from "react-redux";
import { HotKeys } from "react-hotkeys";

import sizing from "@/styles/sizing.module.css";

import { evolveSim } from "@/actions/sim-evolve";
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

import { cls } from "@/utils";

export interface CircuitFieldViewProps {
  className?: string;
}

const CircuitFieldView: React.FC<CircuitFieldViewProps> = ({ className }) => {
  const dispatch = useDispatch();
  const keyHandlers = React.useMemo(() => {
    let keyHandlers: KeymapHandler = {
      [KEYMAP_SIM_STEP]: () => dispatch(evolveSim(1)),
      [KEYMAP_SIM_FASTFORWARD]: () => dispatch(fastForwardSim()),
      [KEYMAP_NODE_COPY]: () => dispatch(selectionCopy()),
      [KEYMAP_NODE_PASTE]: () => dispatch(paste()),
      [KEYMAP_NODE_DELETE]: () => dispatch(selectionDelete())
    };
    return keyHandlers;
  }, [dispatch]);

  return (
    <HotKeys
      className={cls(className, sizing["fill-parent"])}
      keyMap={keymap}
      handlers={keyHandlers}
    >
      <CircuitField />
    </HotKeys>
  );
};

export default CircuitFieldView;
