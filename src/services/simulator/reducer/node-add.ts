import { isAddNodeAction } from "@/actions/node-add";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isAddNodeAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;

  return collectNodeTransitions(state, nodeId, appState);

  // const def = NodeTypes[type];
  // if (!def) {
  //   return state;
  // }

  // const inputs = inputsOf(def);
  // const outputs = outputsOf(def);

  // const result = def.evolve
  //   ? def.evolve(
  //       undefined,
  //       mapValues(inputs, () => false),
  //       state.tick
  //     )
  //   : {};

  // const nodeState = result.state || {};

  // let transitions: OutputTransition[] = [];
  // if (result.transitions) {
  //   transitions = asArray(result.transitions);
  // }

  // const outputValues = transitions.reduce(
  //   (values, transition) => ({ ...values, ...transition.valuesByPin }),
  //   mapValues(outputs, () => false)
  // );

  // return {
  //   ...state,
  //   nodeStatesByNodeId: {
  //     ...state.nodeStatesByNodeId,
  //     [id]: nodeState
  //   },
  //   nodeOutputValuesByNodeId: {
  //     ...state.nodeOutputValuesByNodeId,
  //     [id]: outputValues
  //   }
  // };
});
