import * as React from "react";
import { useDispatch } from "react-redux";
import uniq from "lodash/uniq";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { acceptDialog } from "@/actions/dialog-response-accept";
import { cancelDialog } from "@/actions/dialog-response-cancel";

import { dialogDataSelector } from "@/services/dialog/selectors/dialog";

import Dialog from "@/components/Dialog";
import Checkbox from "@/components/Checkbox";

import styles from "./ImportProjectCircuitsDialog.module.css";
import { ImportProjectCircuitsDialogData } from "./types";

const ImportProjectCircuitsDialog: React.FC = () => {
  const dispatch = useDispatch();
  const dialogData: ImportProjectCircuitsDialogData | null = useSelector(
    dialogDataSelector
  ) as any;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const onCloseDialog = useAction(cancelDialog);
  const onAcceptDialog = React.useCallback(() => {
    dispatch(acceptDialog(selectedIds));
  }, [dispatch, selectedIds]);

  if (!dialogData) {
    return null;
  }

  const { circuits } = dialogData;

  return (
    <Dialog
      isOpen={true}
      title="Import Circuits"
      onAccept={onAcceptDialog}
      onCancel={onCloseDialog}
      acceptText="Import Circuits"
    >
      <div>
        <p>Choose the circuits to import.</p>
        <p>
          Any chosen circuits that depend on other circuits will import their
          dependencies automatically.
        </p>
        <p>
          If any circuits already exist in your project, they will not be
          re-imported.
        </p>
      </div>
      <ul className={styles["import-project-circuits-list"]}>
        {circuits.map(({ circuitId, circuitName }) => (
          <li key={circuitId}>
            <ImportCircuitCheckbox
              circuitId={circuitId}
              circuitName={circuitName}
              selectedIds={selectedIds}
              onSetSelectedIds={setSelectedIds}
            />
          </li>
        ))}
      </ul>
    </Dialog>
  );
};

interface ImportCircuitCheckboxProps {
  circuitId: string;
  circuitName: string;
  selectedIds: string[];
  onSetSelectedIds(selectedIds: string[]): void;
}
const ImportCircuitCheckbox: React.FC<ImportCircuitCheckboxProps> = ({
  circuitId,
  circuitName,
  selectedIds,
  onSetSelectedIds,
}) => {
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        onSetSelectedIds(uniq([...selectedIds, circuitId]));
      }
    },
    [circuitId, onSetSelectedIds, selectedIds]
  );

  return (
    <Checkbox onChange={onChange} value={selectedIds.indexOf(circuitId) !== -1}>
      {circuitName}
    </Checkbox>
  );
};

export default ImportProjectCircuitsDialog;
