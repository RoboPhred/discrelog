import { AnyAction } from "redux";
import zipObject from "lodash/zipObject";
import map from "lodash/map";
import values from "lodash/values";
import { v4 as uuidV4 } from "uuid";

import { pointAdd, snapPoint } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import rootReducer from "@/store/reducer";

import { addNode } from "@/actions/node-add";
import { attachWire } from "@/actions/wire-attach";
import { isPasteAction } from "@/actions/clipboard-paste";
import { selectNodes } from "@/actions/select-nodes";

import { gridNodeSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";
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

  const { clipboardNodes, clipboardPasteOrigin } = state.services.clipboard;

  if (!clipboardNodes.length) {
    return state;
  }

  let { pastePosition } = action.payload;

  const gridSnap = gridNodeSnapSelector(state);
  if (!pastePosition) {
    pastePosition = pointAdd(clipboardPasteOrigin, {
      x: gridSnap,
      y: gridSnap,
    });
  } else {
    pastePosition = snapPoint(pastePosition, gridSnap);
  }

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
      addNode(nodeType, circuitId, p, { nodeId: pasteIds[id] })
    );
  }

  // Wire the nodes
  for (const node of clipboardNodes) {
    const { id, outputs } = node;
    const sourceId = pasteIds[id];
    for (const outputPin of Object.keys(outputs)) {
      for (const output of outputs[outputPin]) {
        const {
          pin: { nodeId: targetCopyId, pinId: targetPin },
          joints,
        } = output;
        const targetId = pasteIds[targetCopyId];
        state = rootReducer(
          state,
          attachWire(
            { nodeId: sourceId, pinId: outputPin },
            { nodeId: targetId, pinId: targetPin },
            {
              joints: joints.map((jointPos) =>
                pointAdd(jointPos, pastePosition!)
              ),
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
  state = rootReducer(state, selectNodes(values(pasteIds)));

  return state;
}
