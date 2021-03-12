import * as React from "react";
import { useDispatch } from "react-redux";
import { HotKeys } from "react-hotkeys";
import { AnyAction } from "redux";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import sizing from "@/styles/sizing.module.css";
import flex from "@/styles/flex.module.css";

import { tickSim } from "@/actions/sim-tick";
import { fastForwardSim } from "@/actions/sim-fastforward";
import { paste } from "@/actions/clipboard-paste";
import { copySelection } from "@/actions/selection-copy";
import { deleteSelection } from "@/actions/selection-delete";
import { selectAll } from "@/actions/select-all";
import { undo } from "@/actions/undo";
import { redo } from "@/actions/redo";
import { activateView } from "@/actions/view-activate";

import CircuitNodeBreadcrumb from "@/components/CircuitNodeBreadcrumb";
import CircuitField from "@/components/CircuitField";
import TesselWindow from "@/components/Tessel/TesselWindow";
import { useTesselPath } from "@/components/Tessel/TesselContext";

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
import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

export interface CircuitFieldWindowProps {
  circuitId: string;
  circuitNodeIdPath: string[];
}
const CircuitFieldWindow: React.FC<CircuitFieldWindowProps> = ({
  circuitId,
  circuitNodeIdPath,
}) => {
  const dispatch = useDispatch();
  const tesselPath = useTesselPath();

  const circuitName =
    useSelector((state) => circuitNameFromIdSelector(state, circuitId)) ??
    "<Circuit Missing>";

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
      [KEYMAP_SELECT_ALL]: createEventDispatcher(selectAll(circuitId)),
      [KEYMAP_COPY]: createEventDispatcher(copySelection()),
      [KEYMAP_PASTE]: createEventDispatcher(paste(circuitId)),
      [KEYMAP_DELETE]: createEventDispatcher(deleteSelection()),
      [KEYMAP_UNDO]: createEventDispatcher(undo()),
      [KEYMAP_REDO]: createEventDispatcher(redo()),
    };
    return keyHandlers;
  }, [dispatch, circuitId]);

  const onViewActivated = React.useCallback(() => {
    dispatch(activateView(tesselPath));
  }, [dispatch, tesselPath]);

  if (!circuitId || !circuitNodeIdPath) {
    return (
      <div>
        Misconfigured circuit field window. Window must have a circuit id and
        circuit node id path.
      </div>
    );
  }

  return (
    <TesselWindow title={`${circuitName} [Circuit]`}>
      <HotKeys keyMap={keymap} handlers={keyHandlers} component={FillParent}>
        <div
          onFocus={onViewActivated}
          className={cls(
            "circuit-field-view",
            sizing["fill-parent"],
            flex["flex-column"]
          )}
        >
          <CircuitNodeBreadcrumb
            circuitId={circuitId}
            circuitNodeIdPath={circuitNodeIdPath}
          />
          <CircuitField
            className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}
            circuitId={circuitId}
            circuitNodePath={circuitNodeIdPath}
          />
        </div>
      </HotKeys>
    </TesselWindow>
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
