import * as React from "react";
import { useDispatch } from "react-redux";
import { createUseStyles } from "react-jss";
import { HotKeys } from "react-hotkeys";

import { cls } from "@/utils";

import { evolveSim } from "@/services/simulator/actions/sim-evolve";
import { fastForwardSim } from "@/services/simulator/actions/sim-fastforward";

import { selectionCopy } from "../../actions/selection-copy";
import { paste } from "../../actions/clipboard-paste";
import { selectionDelete } from "../../actions/selection-delete";

import keymap, {
  KeymapHandler,
  KEYMAP_SIM_STEP,
  KEYMAP_SIM_FASTFORWARD,
  KEYMAP_NODE_COPY,
  KEYMAP_NODE_PASTE,
  KEYMAP_NODE_DELETE
} from "./keymap";

import CircuitField from "./components/CircuitField";

export interface CircuitFieldViewProps {
  className?: string;
}

const useStyles = createUseStyles({
  root: {
    overflow: "hidden"
  },
  fillParent: {
    width: "100%",
    height: "100%"
  }
});

const CircuitFieldView: React.FC<CircuitFieldViewProps> = ({ className }) => {
  const styles = useStyles();
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
    <div className={cls(className, styles.root)}>
      <HotKeys
        className={styles.fillParent}
        keyMap={keymap}
        handlers={keyHandlers}
      >
        <CircuitField />
      </HotKeys>
    </div>
  );
};

export default CircuitFieldView;
