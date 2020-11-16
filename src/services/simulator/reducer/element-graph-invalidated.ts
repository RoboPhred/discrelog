import { isAddElementAction } from "@/actions/element-add";
import { isDeleteNodeAction } from "@/actions/node-delete";
import { isAttachWireAction } from "@/actions/wire-attach";
import { isDetatchWireAction } from "@/actions/wire-detatch";

import { defaultSimulatorState } from "../state";
import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action) => {
  if (
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
