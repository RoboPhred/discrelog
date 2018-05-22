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

  nodeStatesByNodeId[id] = {};
  nodeOutputValuesByNodeId[id] = mapValues(def.outputs, () => false);
}

export default produce(addNodeMutator);
