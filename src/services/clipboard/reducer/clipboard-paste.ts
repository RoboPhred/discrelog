import { AnyAction } from "redux";
import zipObject from "lodash/zipObject";
import map from "lodash/map";
import values from "lodash/values";
import { v4 as uuidV4 } from "uuid";

import { pointAdd } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import rootReducer from "@/store/reducer";

import { addNode } from "@/actions/node-add";
import { attachWire } from "@/actions/wire-attach";
import { isPasteAction } from "@/actions/clipboard-paste";
import { selectNodes } from "@/actions/select-nodes";

import { gridNodeSnapSelector } from "@/services/circuit-editor-ui-drag/selectors/snap";

export default function clipboardPasteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isPasteAction(action)) {
    return state;
  }

  const { targetCircuitId } = action.payload;

  const { clipboardNodes, clipboardPasteOrigin } = state.services.clipboard;
  const gridSnap = gridNodeSnapSelector(state);
  const pastePosition = pointAdd(clipboardPasteOrigin, {
    x: gridSnap,
    y: gridSnap,
  });

  const pasteIds = zipObject(
    clipboardNodes.map((x) => x.id),
    map(clipboardNodes, () => uuidV4())
  );

  // Two passes: Create and Wire.

  // Create the nodes.
  for (const node of clipboardNodes) {
    const { id, nodeType, offset } = node;
    const p = pointAdd(pastePosition, offset);
    state = rootReducer(
      state,
      addNode(nodeType, targetCircuitId, p, { nodeId: pasteIds[id] })
    );
  }

  // Wire the nodes
  for (const node of clipboardNodes) {
    const { id, outputs } = node;
    const sourceId = pasteIds[id];
    for (const outputPin of Object.keys(outputs)) {
      for (const output of outputs[outputPin]) {
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
