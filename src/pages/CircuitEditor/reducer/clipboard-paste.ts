import { AnyAction } from "redux";
import zipObject from "lodash/zipObject";
import map from "lodash/map";
import values from "lodash/values";
import uuidV4 from "uuid/v4";

import { Point } from "@/types";
import { pointAdd, ZeroPoint } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { attachWire } from "@/services/simulator/actions/wire-attach";

import { isPasteAction } from "../actions/clipboard-paste";
import { addNode } from "../actions/node-add";
import { selectNodes } from "../actions/select-nodes";
import { fpSet } from "@/utils";

export const CLIPBOARD_PASTE_OFFSET: Point = { x: 10, y: 10 };

export default function clipboardPasteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isPasteAction(action)) {
    return state;
  }

  const circuitEditorState = state.ui.circuitEditor;

  const clipboardNodes = circuitEditorState.clipboardContent;
  const pastePosition = pointAdd(
    circuitEditorState.clipboardOrigin || ZeroPoint,
    CLIPBOARD_PASTE_OFFSET
  );

  const pasteIds = zipObject(
    clipboardNodes.map(x => x.id),
    map(clipboardNodes, () => uuidV4())
  );

  // Two passes: Create and Wire.

  // Create the nodes.
  for (let node of clipboardNodes) {
    const { id, type, offset } = node;
    const p = pointAdd(pastePosition, offset);
    state = rootReducer(state, addNode(type, p.x, p.y, pasteIds[id]));
  }

  // Wire the nodes
  for (let node of clipboardNodes) {
    const { id, outputs } = node;
    const sourceId = pasteIds[id];
    for (let outputPin of Object.keys(outputs)) {
      for (let output of outputs[outputPin]) {
        const { nodeId: targetCopyId, pinId: targetPin } = output;
        const targetId = pasteIds[targetCopyId];
        state = rootReducer(
          state,
          attachWire(
            { nodeId: sourceId, pinId: outputPin },
            { nodeId: targetId, pinId: targetPin }
          )
        );
      }
    }
  }

  state = fpSet(state, "ui", "circuitEditor", "clipboardOrigin", pastePosition);
  state = rootReducer(state, selectNodes(values(pasteIds)));

  return state;
}
