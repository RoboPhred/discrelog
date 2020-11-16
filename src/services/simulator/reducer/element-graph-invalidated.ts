import { isAddElementAction } from "@/actions/element-add";
import { isFieldDragStartNewNodeAction } from "@/actions/field-drag-start-newnode";
import { isNewFileAction } from "@/actions/file-new";
import { isDeleteNodeAction } from "@/actions/node-delete";
import { isAttachWireAction } from "@/actions/wire-attach";
import { isDetatchWireAction } from "@/actions/wire-detatch";

import { defaultSimulatorState } from "../state";
import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action) => {
  if (
    isNewFileAction(action) ||
    isAddElementAction(action) ||
    isDeleteNodeAction(action) ||
    isAttachWireAction(action) ||
    isDetatchWireAction(action)
  ) {
    // Reset the simulator but keep the ticks per second choice.
    return {
      ...defaultSimulatorState,
      ticksPerSecond: state.ticksPerSecond,
    };
  }

  return state;
});
