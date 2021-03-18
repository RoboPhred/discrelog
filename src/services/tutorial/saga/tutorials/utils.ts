import { AnyAction } from "redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, take } from "redux-saga/effects";
import { Options } from "@popperjs/core";

import { NodeDefinition } from "@/nodes/types";

import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";
import {
  Connection,
  NodePin,
  nodePinEquals,
} from "@/services/node-graph/types";
import { connectionsSelector } from "@/services/node-graph/selectors/connections";

import { ACTION_NODE_ADD, AddNodeAction } from "@/actions/node-add";
import { tutorialAnnotate } from "@/actions/tutorial-annotate";
import { ACTION_CIRCUIT_EDITOR_DRAG_END } from "@/actions/circuit-editor-drag-end";
import { ACTION_TUTORIAL_NEXT, tutorialNext } from "@/actions/tutorial-next";
import { getCircuitEditorHtmlId } from "@/components/CircuitEditor/ids";

export interface CreateNodeTutorialStepOptions {
  trayMessage?: string;
  fieldMessage?: string;
}
export function* createNodeTutorialStep(
  nodeType: string,
  opts: CreateNodeTutorialStepOptions = {}
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
        message: opts.trayMessage ?? `This is a ${def.displayName} element`,
      },
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
        message:
          opts.fieldMessage ??
          `Drag the ${def.displayName} element onto the circuit field.`,
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

export function* waitNodeWired(outputPin: NodePin, inputPin: NodePin) {
  while (true) {
    const wired: boolean = yield call(isWired, outputPin, inputPin);
    if (wired) {
      return;
    }
    // TODO: We can only detect wiring through drag end.  Might want to make drag use real actions
    //  and wait on node-wire instead.
    yield take(ACTION_CIRCUIT_EDITOR_DRAG_END);
  }
}

function* isWired(
  outputPin: NodePin,
  inputPin: NodePin
): SagaIterator<boolean> {
  const connections: Connection[] = yield select(connectionsSelector);
  return connections.some(
    ({ inputPin: connInputPin, outputPin: connOutputPin }) =>
      nodePinEquals(connInputPin, inputPin) &&
      nodePinEquals(connOutputPin, outputPin)
  );
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

export interface TutorialNextMessageOptions {
  placement?: Options["placement"];
  additionalSelectors?: string[];
}
export function* tutorialNextMessage(
  selector: string,
  message: string,
  opts: TutorialNextMessageOptions = {}
) {
  yield put(
    tutorialAnnotate([
      {
        selector,
        message,
        placement: opts.placement,
        action: {
          name: "Next",
          action: tutorialNext(),
        },
      },
      ...(opts.additionalSelectors ?? []).map((selector) => ({ selector })),
    ])
  );

  yield take(ACTION_TUTORIAL_NEXT);
}
