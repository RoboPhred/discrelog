import fileDialog from "file-dialog";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";

import { elementTypeToCircuitId } from "@/elements/definitions/integrated-circuits/utils";

import { ACTION_PROJECT_IMPORT_CIRCUITS } from "@/actions/project-import-circuits";
import { importCircuits } from "@/actions/circuit-import";

import { SaveData } from "@/services/savedata/types";
import { displayDialogSaga } from "@/services/dialog/api";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

export default function* projectImportCircuitsSaga() {
  yield takeEvery(ACTION_PROJECT_IMPORT_CIRCUITS, handleProjectImportCircuits);
}

function* handleProjectImportCircuits(): SagaIterator {
  const [file]: File[] = yield call(fileDialog, {
    accept: "application/json",
  });
  const contents = yield call(file.text.bind(file));
  const saveData: SaveData = JSON.parse(contents);

  const result: string[] | undefined = yield call(
    displayDialogSaga,
    "import-project-circuits",
    {
      circuits: saveData.circuits.filter(
        (x) => x.circuitId !== ROOT_CIRCUIT_ID
      ),
    }
  );

  if (!Array.isArray(result)) {
    return;
  }

  const scanCircuitIds = result;
  const targetCircuitIds: string[] = [];
  // Scan through the list of circuits and import dependencies.
  let circuitId: string | undefined;
  while ((circuitId = scanCircuitIds.pop())) {
    targetCircuitIds.push(circuitId);
    for (const element of saveData.elements) {
      const { circuitId: elementCircuitId, elementType: elementType } = element;
      if (circuitId !== elementCircuitId) {
        continue;
      }
      const elementIcCircuitId = elementTypeToCircuitId(elementType);
      if (elementIcCircuitId == null) {
        continue;
      }
      scanCircuitIds.push(elementIcCircuitId);
    }
  }

  yield put(importCircuits(targetCircuitIds, saveData));
}
