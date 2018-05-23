import { mapValues } from "lodash-es";
import produce from "immer";

import { AddNodeAction } from "../actions";
import { NodeTypes } from "../node-types";
import { SimulatorState } from "../state";

export function addNodeMutator(state: SimulatorState, action: AddNodeAction) {
  const { nodeId: id, nodeType: type } = action.payload;

  const def = NodeTypes[type];
  if (!def) {
    return;
  }

  const { nodesById, nodeStatesByNodeId, nodeOutputValuesByNodeId } = state;

  nodesById[id] = {
    id,
    type,
    inputConnectionsByPin: mapValues(def.inputs, () => null),
    outputConnectionsByPin: mapValues(def.outputs, () => [])
  };

  const result = def.evolve
    ? def.evolve(undefined, mapValues(def.inputs, () => false), state.tick)
    : {};

  nodeStatesByNodeId[id] = result.state || {};
  nodeOutputValuesByNodeId[id] = result.transitions
    ? mapValues(result.transitions, x => x.value)
    : mapValues(def.outputs, () => false);
}

export default produce(addNodeMutator);
