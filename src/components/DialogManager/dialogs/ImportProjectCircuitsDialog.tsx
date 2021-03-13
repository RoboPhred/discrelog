import * as React from "react";
import { useDispatch } from "react-redux";
import uniq from "lodash/uniq";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { acceptDialog } from "@/actions/dialog-response-accept";
import { cancelDialog } from "@/actions/dialog-response-cancel";

import { ImportProjectCircuitsDialogData } from "@/services/dialog/state";
import { dialogDataSelector } from "@/services/dialog/selectors/dialog";

import Dialog from "@/components/Dialog";
import Checkbox from "@/components/Checkbox";

import styles from "./Dialogs.module.css";

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
      onAccept={onAcceptDialog}
      onCancel={onCloseDialog}
      acceptText="Import Circuits"
    >
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
