import fileDialog from "file-dialog";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";

import { nodeTypeToCircuitId } from "@/nodes/definitions/integrated-circuits/utils";

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
    for (const node of saveData.nodes) {
      const { circuitId: nodeCircuitId, nodeType } = node;
      if (circuitId !== nodeCircuitId) {
        continue;
      }
      const nodeIcCircuitId = nodeTypeToCircuitId(nodeType);
      if (nodeIcCircuitId == null) {
        continue;
      }
      scanCircuitIds.push(nodeIcCircuitId);
    }
  }

  yield put(importCircuits(targetCircuitIds, saveData));
}
