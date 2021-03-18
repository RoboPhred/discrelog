import { AnyAction } from "redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, take } from "redux-saga/effects";

import { NodeDefinition } from "@/nodes/types";

import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";

import { ACTION_NODE_ADD, AddNodeAction } from "@/actions/node-add";
import { tutorialAnnotate } from "@/actions/tutorial-annotate";

import { getCircuitEditorHtmlId } from "@/components/CircuitEditor/ids";

export function* createNodeTutorialStep(
  nodeType: string
): SagaIterator<string | null> {
  const def: NodeDefinition = yield select((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );
  if (!def) {
    return null;
  }

  const activeEditorId: string | null = yield select(
    activeCircuitEditorIdSelector
  );
  if (!activeEditorId) {
    return null;
  }

  yield put(
    tutorialAnnotate([
      {
        selector: `#node-tray--node-${nodeType}`,
        message: `This is a ${def.displayName} element`,
      },
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
        message: `Drag the ${def.displayName} element onto the circuit field.`,
        placement: "top",
      },
    ])
  );

  const nodeAddAction: AddNodeAction = yield call(() =>
    waitFilterAction(
      ACTION_NODE_ADD,
      ({ payload: { nodeType: addedNodeType } }) => addedNodeType === nodeType
    )
  );

  return nodeAddAction.payload.nodeId;
}

export function waitFilterAction(
  actionType: string,
  filter: (action: AnyAction) => boolean
): SagaIterator<AnyAction>;
export function waitFilterAction<T extends AnyAction>(
  actionType: string,
  filter: (action: T) => boolean
): SagaIterator<T>;
export function* waitFilterAction(
  actionType: string,
  filter: (action: any) => boolean
): SagaIterator<any> {
  let action: AnyAction;
  while ((action = yield take(actionType))) {
    if (!filter(action)) {
      continue;
    }
    break;
  }

  return action;
}
