import { AnyAction } from "redux";
import zipObject from "lodash/zipObject";
import map from "lodash/map";
import values from "lodash/values";
import uuidV4 from "uuid/v4";

import { Point } from "@/types";
import { pointAdd, ZeroPoint } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import rootReducer from "@/store/reducer";

import { attachWire } from "@/actions/wire-attach";
import { addNode } from "@/actions/node-add";
import { isPasteAction } from "@/actions/clipboard-paste";
import { selectNodes } from "@/actions/select-nodes";

export const CLIPBOARD_PASTE_OFFSET: Point = { x: 10, y: 10 };

export default function clipboardPasteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isPasteAction(action)) {
    return state;
  }

  const { clipboardNodes, clipboardPasteOrigin } = state.services.clipboard;
  const pastePosition = pointAdd(clipboardPasteOrigin, CLIPBOARD_PASTE_OFFSET);

  const pasteIds = zipObject(
    clipboardNodes.map(x => x.id),
    map(clipboardNodes, () => uuidV4())
  );

  // Two passes: Create and Wire.

  // Create the nodes.
  for (let node of clipboardNodes) {
    const { id, type, offset } = node;
    const p = pointAdd(pastePosition, offset);
    state = rootReducer(
      state,
      addNode(type, { position: p, nodeId: pasteIds[id] })
    );
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

  state = fpSet(
    state,
    "services",
    "clipboard",
    "clipboardPasteOrigin",
    pastePosition
  );
  state = rootReducer(state, selectNodes(values(pasteIds)));

  return state;
}