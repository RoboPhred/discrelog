import { AnyAction } from "redux";
import produce from "immer";
import mapValues from "lodash/mapValues";

import { NodeTypes } from "../node-types";
import { inputsOf, outputsOf } from "../node-types/utils";
import { SimulatorState, defaultSimulatorState } from "../state";
import { isAddNodeAction } from "../actions/node-add";

export default function nodeAddReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  return produce(state, draft => addNodeMutator(draft, action));
}

function addNodeMutator(state: SimulatorState, action: AnyAction) {
  if (!isAddNodeAction(action)) {
    return;
  }

  const { nodeId: id, nodeType: type } = action.payload;

  const def = NodeTypes[type];
  if (!def) {
    return;
  }

  const { nodesById, nodeStatesByNodeId, nodeOutputValuesByNodeId } = state;

  const inputs = inputsOf(def);
  const outputs = outputsOf(def);

  nodesById[id] = {
    id,
    type
  };

  const result = def.evolve
    ? def.evolve(
        undefined,
        mapValues(inputs, () => false),
        state.tick
      )
    : {};

  nodeStatesByNodeId[id] = result.state || {};
  nodeOutputValuesByNodeId[id] = result.transitions
    ? mapValues(result.transitions, x => x.value)
    : mapValues(outputs, () => false);
}
