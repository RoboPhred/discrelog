import { AnyAction } from "redux";
import mapValues from "lodash/mapValues";

import { isAddNodeAction } from "@/actions/node-add";

import { NodeTypes } from "@/node-defs";
import { inputsOf, outputsOf } from "@/node-defs/utils";

import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action: AnyAction) => {
  if (!isAddNodeAction(action)) {
    return state;
  }

  const { nodeId: id, nodeType: type } = action.payload;

  const def = NodeTypes[type];
  if (!def) {
    return state;
  }

  const inputs = inputsOf(def);
  const outputs = outputsOf(def);

  const result = def.evolve
    ? def.evolve(
        undefined,
        mapValues(inputs, () => false),
        state.tick
      )
    : {};

  const nodeState = result.state || {};
  const outputValues = result.transitions
    ? mapValues(result.transitions, x => x.value)
    : mapValues(outputs, () => false);

  return {
    ...state,
    nodeStatesByNodeId: {
      ...state.nodeStatesByNodeId,
      [id]: nodeState
    },
    nodeOutputValuesByNodeId: {
      ...state.nodeOutputValuesByNodeId,
      [id]: outputValues
    }
  };
});
