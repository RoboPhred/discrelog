import { call, put, select, take } from "redux-saga/effects";

import { arrayEquals } from "@/arrays";

import { ACTION_CIRCUIT_EDITOR_DRAG_END } from "@/actions/circuit-editor-drag-end";
import {
  ACTION_NODE_INTERACT,
  InteractNodeAction,
} from "@/actions/node-interact";
import { ACTION_SIM_START } from "@/actions/sim-start";
import { tutorialAnnotate } from "@/actions/tutorial-annotate";
import { tutorialDismiss } from "@/actions/tutorial-dismiss";
import { ACTION_TUTORIAL_NEXT, tutorialNext } from "@/actions/tutorial-next";

import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import {
  getCircuitEditorHtmlId,
  getNodeHtmlId,
  getNodePinHtmlId,
} from "@/components/CircuitEditor/ids";

import {
  createNodeTutorialStep,
  waitFilterAction,
  waitNodeWired,
} from "./utils";

export default function* runBasicsTutorial() {
  yield put(
    tutorialAnnotate({
      selector: "#node-tray",
      message: "This is where logic elements are stored",
      action: {
        name: "Next",
        action: tutorialNext(),
      },
    })
  );

  yield take(ACTION_TUTORIAL_NEXT);

  const gateId: string | null = yield call(createNodeTutorialStep, "logic-not");
  if (!gateId) {
    yield put(tutorialDismiss());
    return;
  }

  const switchId: string | null = yield call(
    createNodeTutorialStep,
    "interaction-momentary"
  );
  if (!switchId) {
    yield put(tutorialDismiss());
    return;
  }

  const ledId: string | null = yield call(createNodeTutorialStep, "output-led");
  if (!ledId) {
    yield put(tutorialDismiss());
    return;
  }

  const activeEditorId: string | null = yield select(
    activeCircuitEditorIdSelector
  );
  if (!activeEditorId) {
    yield put(tutorialDismiss());
    return;
  }

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, switchId, "OUT"),
        message: "This is the switch's output pin.",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, gateId, "IN"),
        message: "This is the logic gate's input pin.",
        placement: "bottom",
      },
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
        message: "Click and drag from one pin to another to connect them.",
        placement: "top",
      },
    ])
  );

  yield call(
    waitNodeWired,
    { nodeId: switchId, pinId: "OUT" },
    { nodeId: gateId, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, gateId, "OUT"),
        message: "This is the logic gate's output pin.",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, ledId, "IN"),
        message: "This is the LED's input pin.",
        placement: "bottom",
      },
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
        message: "Click and drag from one pin to another to connect them.",
        placement: "top",
      },
    ])
  );

  yield call(
    waitNodeWired,
    { nodeId: gateId, pinId: "OUT" },
    { nodeId: ledId, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate({
      selector: "#simctrl-run",
      message: "Click here to run the simulation.",
    })
  );

  yield take(ACTION_SIM_START);

  yield put(
    tutorialAnnotate([
      // Unfortunately, since we use absolute positioning, the z-index on the node will not function unless
      // we also raise the field
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
      },
      {
        selector: "#" + getNodeHtmlId(activeEditorId, switchId),
        message:
          "Click the switch to activate it.  Momentary switches need to be held.",
      },
    ])
  );

  yield call(() =>
    waitFilterAction<InteractNodeAction>(
      ACTION_NODE_INTERACT,
      ({ payload: { circuitNodeIdPath, data } }) =>
        data === true && arrayEquals(circuitNodeIdPath, [switchId])
    )
  );

  yield put(
    tutorialAnnotate({
      selector: "#" + getCircuitEditorHtmlId(activeEditorId),
      placement: "top",
      message: "That's it!",
      action: {
        name: "End Tutorial",
        action: tutorialDismiss(),
      },
    })
  );
}
