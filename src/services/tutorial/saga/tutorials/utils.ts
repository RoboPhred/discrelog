import { AnyAction } from "redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, take } from "redux-saga/effects";
import { Options } from "@popperjs/core";

import { ElementDefinition } from "@/elements/types";

import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { elementDefinitionFromTypeSelector } from "@/services/element-types/selectors/element-types";
import {
  Connection,
  ElementPin,
  elementPinEquals,
} from "@/services/element-graph/types";
import { connectionsSelector } from "@/services/element-graph/selectors/connections";

import { ACTION_ELEMENT_ADD, AddElementAction } from "@/actions/element-add";
import { tutorialAnnotate } from "@/actions/tutorial-annotate";
import { ACTION_CIRCUIT_EDITOR_DRAG_END } from "@/actions/circuit-editor-drag-end";
import { ACTION_TUTORIAL_NEXT, tutorialNext } from "@/actions/tutorial-next";
import { getCircuitEditorHtmlId } from "@/components/CircuitEditor/ids";

export interface AddElementTutorialStepOptions {
  trayMessage?: string;
  fieldMessage?: string;
}
export function* addElementTutorialStep(
  elementType: string,
  opts: AddElementTutorialStepOptions = {}
): SagaIterator<string | null> {
  const def: ElementDefinition = yield select((state) =>
    elementDefinitionFromTypeSelector(state, elementType)
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
        selector: `#element-tray--element-${elementType}`,
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

  const addElementAction: AddElementAction = yield call(() =>
    waitFilterAction(
      ACTION_ELEMENT_ADD,
      ({ payload: { elementType: addedElementType } }) =>
        addedElementType === elementType
    )
  );

  return addElementAction.payload.elementId;
}

export function* waitNodeWired(outputPin: ElementPin, inputPin: ElementPin) {
  while (true) {
    const wired: boolean = yield call(isWired, outputPin, inputPin);
    if (wired) {
      return;
    }
    // TODO: We can only detect wiring through drag end.  Might want to make drag use real actions
    //  and wait on wire action instead.
    yield take(ACTION_CIRCUIT_EDITOR_DRAG_END);
  }
}

function* isWired(
  outputPin: ElementPin,
  inputPin: ElementPin
): SagaIterator<boolean> {
  const connections: Connection[] = yield select(connectionsSelector);
  return connections.some(
    ({ inputPin: connInputPin, outputPin: connOutputPin }) =>
      elementPinEquals(connInputPin, inputPin) &&
      elementPinEquals(connOutputPin, outputPin)
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
