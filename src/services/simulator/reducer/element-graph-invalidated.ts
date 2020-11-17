import { ACTION_ELEMENT_ADD } from "@/actions/element-add";
import { ACTION_FILE_NEW } from "@/actions/file-new";
import { ACTION_NODE_DELETE } from "@/actions/node-delete";
import { ACTION_PROJECT_RECEIVE } from "@/actions/project-receive";
import { ACTION_WIRE_ATTACH } from "@/actions/wire-attach";
import { ACTION_WIRE_DETATCH } from "@/actions/wire-detatch";

import { defaultSimulatorState } from "../state";
import { createSimulatorReducer } from "../utils";

const SIM_INVALIDATE_ACTIONS = [
  ACTION_FILE_NEW,
  ACTION_PROJECT_RECEIVE,
  ACTION_ELEMENT_ADD,
  ACTION_NODE_DELETE,
  ACTION_WIRE_ATTACH,
  ACTION_WIRE_DETATCH,
];

export default createSimulatorReducer((state, action) => {
  if (SIM_INVALIDATE_ACTIONS.indexOf(action.type) !== -1) {
    // Reset the simulator but keep the ticks per second choice.
    return {
      ...defaultSimulatorState,
      ticksPerSecond: state.ticksPerSecond,
    };
  }

  return state;
});
