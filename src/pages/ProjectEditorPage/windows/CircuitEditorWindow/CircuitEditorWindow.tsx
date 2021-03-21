import * as React from "react";
import { useDispatch } from "react-redux";
import { HotKeys } from "react-hotkeys";
import { AnyAction } from "redux";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import sizing from "@/styles/sizing.module.css";
import flex from "@/styles/flex.module.css";

import { circuitEditorStateFromIdSelector } from "@/services/circuit-editors/selectors/editor";
import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

import { paste } from "@/actions/clipboard-paste";
import { copySelection } from "@/actions/selection-copy";
import { deleteSelection } from "@/actions/selection-delete";
import { selectAll } from "@/actions/select-all";
import { undo } from "@/actions/undo";
import { redo } from "@/actions/redo";
import { circuitEditorReceiveFocus } from "@/actions/circuit-editor-receive-focus";
import { stepSim } from "@/actions/sim-step";

import CircuitNodeBreadcrumb from "@/components/CircuitNodeBreadcrumb";
import CircuitField from "@/components/CircuitEditor";
import TesselWindow from "@/components/Tessel/TesselWindow";

import keymap, {
  KeymapHandler,
  KEYMAP_SIM_STEP,
  KEYMAP_COPY,
  KEYMAP_PASTE,
  KEYMAP_DELETE,
  KEYMAP_SELECT_ALL,
  KEYMAP_UNDO,
  KEYMAP_REDO,
} from "./keymap";

export interface CircuitEditorWindowProps {
  editorId: string;
}
const CircuitEditorWindow: React.FC<CircuitEditorWindowProps> = ({
  editorId,
}) => {
  const dispatch = useDispatch();
  const { circuitId, elementIdPath } = useSelector((state) =>
    circuitEditorStateFromIdSelector(state, editorId)
  ) ?? { circuitId: null, elementIdPath: [] };

  const circuitName =
    useSelector((state) => circuitNameFromIdSelector(state, circuitId)) ??
    "<Circuit Missing>";

  // FIXME: Move key handling into CircuitEditor
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
      [KEYMAP_SIM_STEP]: createEventDispatcher(stepSim()),
      [KEYMAP_SELECT_ALL]: createEventDispatcher(selectAll()),
      [KEYMAP_COPY]: createEventDispatcher(copySelection()),
      [KEYMAP_PASTE]: createEventDispatcher(paste()),
      [KEYMAP_DELETE]: createEventDispatcher(deleteSelection()),
      [KEYMAP_UNDO]: createEventDispatcher(undo()),
      [KEYMAP_REDO]: createEventDispatcher(redo()),
    };
    return keyHandlers;
  }, [dispatch]);

  const onViewActivated = React.useCallback(() => {
    dispatch(circuitEditorReceiveFocus(editorId));
  }, [dispatch, editorId]);

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
            elementIdPath={elementIdPath}
          />
          <CircuitField
            className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}
            editorId={editorId}
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

export default CircuitEditorWindow;
