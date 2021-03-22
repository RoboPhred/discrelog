import { call, put, select, take } from "redux-saga/effects";

import { arrayEquals } from "@/arrays";

import {
  ACTION_ELEMENT_INTERACT,
  InteractElementAction,
} from "@/actions/element-interact";
import { ACTION_SIM_START } from "@/actions/sim-start";
import { tutorialAnnotate } from "@/actions/tutorial-annotate";
import { tutorialDismiss } from "@/actions/tutorial-dismiss";

import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import {
  getCircuitEditorHtmlId,
  getElementHtmlId,
  getElementPinHtmlId,
} from "@/components/CircuitEditor/ids";

import {
  addElementTutorialStep,
  tutorialNextMessage,
  waitFilterAction,
  waitElementConnected,
} from "./utils";

export default function* runBasicsTutorial() {
  yield call(
    tutorialNextMessage,
    "#element-tray",
    "This is where logic elements are stored."
  );

  const gateId: string | null = yield call(addElementTutorialStep, "logic-not");
  if (!gateId) {
    yield put(tutorialDismiss());
    return;
  }

  const switchId: string | null = yield call(
    addElementTutorialStep,
    "interaction-momentary"
  );
  if (!switchId) {
    yield put(tutorialDismiss());
    return;
  }

  const ledId: string | null = yield call(addElementTutorialStep, "output-led");
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
        selector: "#" + getElementPinHtmlId(activeEditorId, switchId, "OUT"),
        message: "This is the switch's output pin.",
        placement: "top",
      },
      {
        selector: "#" + getElementPinHtmlId(activeEditorId, gateId, "IN"),
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
    waitElementConnected,
    { elementId: switchId, pinId: "OUT" },
    { elementId: gateId, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getElementPinHtmlId(activeEditorId, gateId, "OUT"),
        message: "This is the logic gate's output pin.",
        placement: "top",
      },
      {
        selector: "#" + getElementPinHtmlId(activeEditorId, ledId, "IN"),
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
    waitElementConnected,
    { elementId: gateId, pinId: "OUT" },
    { elementId: ledId, pinId: "IN" }
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
      // Unfortunately, since we use absolute positioning, the z-index on the element will not function unless
      // we also raise the field
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
      },
      {
        selector: "#" + getElementHtmlId(activeEditorId, switchId),
        message:
          "Click the switch to activate it.  Momentary switches need to be held.",
      },
    ])
  );

  yield call(() =>
    waitFilterAction<InteractElementAction>(
      ACTION_ELEMENT_INTERACT,
      ({ payload: { elementIdPath, data } }) =>
        data === true && arrayEquals(elementIdPath, [switchId])
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
