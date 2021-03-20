import { call, put, select, take } from "redux-saga/effects";

import { arrayEquals } from "@/arrays";

import { circuitIdToNodeType } from "@/nodes/definitions/integrated-circuits/utils";

import { tutorialAnnotate } from "@/actions/tutorial-annotate";
import { tutorialDismiss } from "@/actions/tutorial-dismiss";
import { ACTION_CIRCUIT_ADD, AddCircuitAction } from "@/actions/circuit-add";
import { ACTION_CIRCUIT_RENAME } from "@/actions/circuit-rename";
import { ACTION_VIEW_CIRCUIT, ViewCircuitAction } from "@/actions/view-circuit";
import {
  ACTION_NODE_INTERACT,
  InteractNodeAction,
} from "@/actions/node-interact";
import { ACTION_SIM_START } from "@/actions/sim-start";
import { ACTION_NODE_RENAME, RenameNodeAction } from "@/actions/node-rename";

import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { getCircuitListItemHtmlId } from "@/pages/ProjectEditorPage/windows/CircuitsTreeWindow/ids";

import {
  getCircuitEditorHtmlId,
  getNodeHtmlId,
  getNodePinHtmlId,
} from "@/components/CircuitEditor/ids";

import {
  createNodeTutorialStep,
  tutorialNextMessage,
  waitFilterAction,
  waitNodeWired,
} from "./utils";

export default function* runCircuitsTutorial() {
  yield call(
    tutorialNextMessage,
    "#circuit-list-window",
    "Circuits are collections of nodes that can be reused as ICs."
  );

  yield put(
    tutorialAnnotate({
      selector: "#circuit-list",
      message: "Right click on the circuit list to create a new circuit.",
    })
  );

  const addCircuitAction: AddCircuitAction = yield take(ACTION_CIRCUIT_ADD);
  const { circuitId } = addCircuitAction.payload;

  yield put(
    tutorialAnnotate({
      selector: "#" + getCircuitListItemHtmlId(circuitId),
      message: "Here is your circuit.  Double click it to rename it.",
    })
  );

  yield take(ACTION_CIRCUIT_RENAME);

  yield put(
    tutorialAnnotate({
      selector: "#" + getCircuitListItemHtmlId(circuitId),
      message: "Click the circuit to view it in the active editor window.",
    })
  );

  yield call(() =>
    waitFilterAction<ViewCircuitAction>(
      ACTION_VIEW_CIRCUIT,
      (action) => action.payload.circuitId === circuitId
    )
  );

  const activeEditorId: string | null = yield select(
    activeCircuitEditorIdSelector
  );
  if (!activeEditorId) {
    yield put(tutorialDismiss());
    return;
  }

  const inputPinId: string | null = yield call(
    createNodeTutorialStep,
    "pin-input"
  );
  if (!inputPinId) {
    yield put(tutorialDismiss());
    return;
  }

  yield call(
    tutorialNextMessage,
    "#" + getNodeHtmlId(activeEditorId, inputPinId),
    "Input pins take a signal from outside for use in your circuit.",
    { additionalSelectors: ["#" + getCircuitEditorHtmlId(activeEditorId)] }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getCircuitEditorHtmlId(activeEditorId),
      },
      {
        selector: "#" + getNodeHtmlId(activeEditorId, inputPinId),
        message:
          "Rename the pin by right clicking it and clicking on the bolded text.  Choose any name you like",
      },
    ])
  );

  yield call(() =>
    waitFilterAction<RenameNodeAction>(
      ACTION_NODE_RENAME,
      (action) => action.payload.nodeId === inputPinId
    )
  );

  yield call(
    tutorialNextMessage,
    "#" + getNodeHtmlId(activeEditorId, inputPinId),
    "Pin names will appear on the body of the IC when used in other circuits.  Be sure to name your pins!"
  );

  const outputPinId1: string | null = yield call(
    createNodeTutorialStep,
    "pin-output"
  );
  if (!outputPinId1) {
    yield put(tutorialDismiss());
    return;
  }

  yield call(
    tutorialNextMessage,
    "#" + getNodeHtmlId(activeEditorId, outputPinId1),
    "Output pins take a signal from your circuit and send it to the outside world."
  );

  const outputPinId2: string | null = yield call(
    createNodeTutorialStep,
    "pin-output",
    {
      trayMessage: "Let's take another output pin",
      fieldMessage:
        "When multiple pins are used, the pins will stack in their vertical orientation on the IC",
    }
  );

  if (!outputPinId2) {
    yield put(tutorialDismiss());
    return;
  }

  yield call(
    tutorialNextMessage,
    "#" + getCircuitEditorHtmlId(activeEditorId),
    "Let's put together a simple circuit.",
    { placement: "top" }
  );

  const bufferId: string | null = yield call(
    createNodeTutorialStep,
    "logic-buffer"
  );
  if (!bufferId) {
    yield put(tutorialDismiss());
    return;
  }

  const notId: string | null = yield call(createNodeTutorialStep, "logic-not");
  if (!notId) {
    yield put(tutorialDismiss());
    return;
  }

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, inputPinId, "OUT"),
        message: "Connect the input signal pin...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, bufferId, "IN"),
        message: "...to the buffer's input.",
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
    { nodeId: inputPinId, pinId: "OUT" },
    { nodeId: bufferId, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, bufferId, "OUT"),
        message: "Connect the buffer's output pin...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, outputPinId1, "IN"),
        message: "...to the IC's first output.",
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
    { nodeId: bufferId, pinId: "OUT" },
    { nodeId: outputPinId1, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, inputPinId, "OUT"),
        message: "Connect the input signal pin...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, notId, "IN"),
        message: "...to the NOT's input.",
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
    { nodeId: inputPinId, pinId: "OUT" },
    { nodeId: notId, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, notId, "OUT"),
        message: "Connect the NOT's output...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, outputPinId2, "IN"),
        message: "...to the second IC output.",
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
    { nodeId: notId, pinId: "OUT" },
    { nodeId: outputPinId2, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate({
      selector: "#" + getCircuitListItemHtmlId(ROOT_CIRCUIT_ID),
      message:
        "We now have a functional IC.  Let's go to the root project and make use of it",
    })
  );

  yield call(() =>
    waitFilterAction<ViewCircuitAction>(
      ACTION_VIEW_CIRCUIT,
      (action) => action.payload.circuitId === ROOT_CIRCUIT_ID
    )
  );

  const icType = circuitIdToNodeType(circuitId);

  const icId: string | null = yield call(createNodeTutorialStep, icType);
  if (!icId) {
    yield put(tutorialDismiss());
    return;
  }

  yield call(
    tutorialNextMessage,
    "#" + getCircuitEditorHtmlId(activeEditorId),
    "Let's wire it up to see it in action.",
    { placement: "top" }
  );

  const switchId: string | null = yield call(
    createNodeTutorialStep,
    "interaction-momentary"
  );
  if (!switchId) {
    yield put(tutorialDismiss());
    return;
  }

  const led1Id: string | null = yield call(
    createNodeTutorialStep,
    "output-led",
    { trayMessage: "Make an LED to check the status of the first pin." }
  );
  if (!led1Id) {
    yield put(tutorialDismiss());
    return;
  }

  const led2Id: string | null = yield call(
    createNodeTutorialStep,
    "output-led",
    { trayMessage: "Make an LED to check the status of the second pin." }
  );
  if (!led2Id) {
    yield put(tutorialDismiss());
    return;
  }

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, switchId, "OUT"),
        message: "Connect the switch output...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, icId, inputPinId),
        message: "...to the IC input.",
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
    { nodeId: icId, pinId: inputPinId }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, icId, outputPinId1),
        message: "Connect the first IC output...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, led1Id, "IN"),
        message: "...to the first LED.",
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
    { nodeId: icId, pinId: outputPinId1 },
    { nodeId: led1Id, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, icId, outputPinId1),
        message: "Connect the first IC output...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, led1Id, "IN"),
        message: "...to the first LED.",
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
    { nodeId: icId, pinId: outputPinId1 },
    { nodeId: led1Id, pinId: "IN" }
  );

  yield put(
    tutorialAnnotate([
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, icId, outputPinId2),
        message: "Connect the second IC output...",
        placement: "top",
      },
      {
        selector: "#" + getNodePinHtmlId(activeEditorId, led2Id, "IN"),
        message: "...to the second LED.",
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
    { nodeId: icId, pinId: outputPinId2 },
    { nodeId: led2Id, pinId: "IN" }
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
      message:
        "You can place as many copies of an IC as you want.  Circuits can also contain other ICs.",
      action: {
        name: "End Tutorial",
        action: tutorialDismiss(),
      },
    })
  );
}
