import { AnyAction } from "redux";
import zipObject from "lodash/zipObject";
import map from "lodash/map";
import values from "lodash/values";
import { v4 as uuidV4 } from "uuid";

import { pointAdd, snapPoint } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import rootReducer from "@/store/reducer";

import { addElement } from "@/actions/element-add";
import { isPasteAction } from "@/actions/clipboard-paste";
import { wireConnect } from "@/actions/wire-connect";
import { selectElements } from "@/actions/select-elements";

import { gridElementSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";
import { activeCircuitIdSelector } from "@/services/circuit-editors/selectors/editor";

export default function clipboardPasteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isPasteAction(action)) {
    return state;
  }

  const circuitId = activeCircuitIdSelector(state);
  if (!circuitId) {
    return state;
  }

  const { clipboardElements, clipboardPasteOrigin } = state.services.clipboard;

  if (!clipboardElements.length) {
    return state;
  }

  let { pastePosition } = action.payload;

  const gridSnap = gridElementSnapSelector(state);
  if (!pastePosition) {
    pastePosition = pointAdd(clipboardPasteOrigin, {
      x: gridSnap,
      y: gridSnap,
    });
  } else {
    pastePosition = snapPoint(pastePosition, gridSnap);
  }

  const pasteIds = zipObject(
    clipboardElements.map((x) => x.id),
    map(clipboardElements, () => uuidV4())
  );

  // Two passes: Create and Connect.

  // Create the elements.
  for (const element of clipboardElements) {
    const { id, elementType: elementType, offset } = element;
    const p = pointAdd(pastePosition, offset);
    state = rootReducer(
      state,
      addElement(elementType, circuitId, p, { elementId: pasteIds[id] })
    );
  }

  // Connect the elements
  for (const element of clipboardElements) {
    const { id, outputs } = element;
    const sourceId = pasteIds[id];
    for (const outputPin of Object.keys(outputs)) {
      for (const output of outputs[outputPin]) {
        const {
          pin: { elementId: targetCopyId, pinId: targetPin },
        } = output;
        const targetId = pasteIds[targetCopyId];
        state = rootReducer(
          state,
          wireConnect(
            circuitId,
            {
              type: "pin",
              pin: { elementId: sourceId, pinId: outputPin },
            },
            {
              type: "pin",
              pin: { elementId: targetId, pinId: targetPin },
            }
          )
        );
      }
    }
  }

  state = fpSet(
    state,
    "services",
    "clipboard",
    "clipboardPasteOrigin",
    pastePosition
  );
  state = rootReducer(state, selectElements(values(pasteIds)));

  return state;
}
