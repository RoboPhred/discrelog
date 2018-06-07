import { mapValues } from "lodash-es";
import produce from "immer";

import { AddNodeAction } from "../actions";
import { NodeTypes } from "../node-types";
import { inputsOf, outputsOf } from "../node-types/utils";
import { SimulatorState } from "../state";

export function addNodeMutator(state: SimulatorState, action: AddNodeAction) {
  const { nodeId: id, nodeType: type } = action.payload;

  const def = NodeTypes[type];
  if (!def) {
    return;
  }

  const {
    nodesById,
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    nodeOutputTransitionsByNodeId
  } = state;

  const inputs = inputsOf(def);
  const outputs = outputsOf(def);

  nodesById[id] = {
    id,
    type,
    inputConnectionsByPin: mapValues(inputs, () => null),
    outputConnectionsByPin: mapValues(outputs, () => [])
  };

  const result = def.evolve
    ? def.evolve(undefined, mapValues(inputs, () => false), state.tick)
    : {};

  nodeStatesByNodeId[id] = result.state || {};
  nodeOutputValuesByNodeId[id] = result.transitions
    ? mapValues(result.transitions, x => x.value)
    : mapValues(outputs, () => false);

  nodeOutputTransitionsByNodeId[id] = mapValues(outputs, () => null);
}

export default produce(addNodeMutator);
