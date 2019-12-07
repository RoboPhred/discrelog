import { Dispatch } from "redux";

import uuidV4 from "uuid/v4";
import zipObject from "lodash/zipObject";
import map from "lodash/map";
import values from "lodash/values";

import { GetState } from "@/store";

import { attachWire } from "@/services/simulator/actions/wire-attach";

import { addNode } from "./node-add";
import { selectNodes } from "./select-nodes";

export const ACTION_PASTE = "@editor/paste" as "@editor/paste";
export const paste = () => (dispatch: Dispatch, getState: GetState) => {
  // TODO: Make a cross-cutting reducer for this.
  //  This should not be a thunk, as it can be implemented as a pure action.
  const state = getState();
  const clipboardNodes = state.ui.circuitEditor.clipboardContent;

  const pasteIds = zipObject(
    clipboardNodes.map(x => x.id),
    map(clipboardNodes, () => uuidV4())
  );

  // Two passes: Create and Wire.

  // Create the nodes.
  for (let node of clipboardNodes) {
    const {
      id,
      type,
      offset: { x, y }
    } = node;
    dispatch(addNode(type, x, y, pasteIds[id]));
  }

  // Wire the nodes
  for (let node of clipboardNodes) {
    const { id, outputs } = node;
    const sourceId = pasteIds[id];
    for (let outputPin of Object.keys(outputs)) {
      for (let output of outputs[outputPin]) {
        const { nodeId: targetCopyId, pinId: targetPin } = output;
        const targetId = pasteIds[targetCopyId];
        dispatch(
          attachWire(
            { nodeId: sourceId, pinId: outputPin },
            { nodeId: targetId, pinId: targetPin }
          )
        );
      }
    }

    // Now this is just getting silly.  This really needs to be a real reducer.
    dispatch(selectNodes(values(pasteIds)));
  }
};
