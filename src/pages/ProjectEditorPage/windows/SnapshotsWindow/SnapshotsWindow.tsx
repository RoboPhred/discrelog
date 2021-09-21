import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";
import { useAction } from "@/hooks/useAction";

import { restoreSnapshot } from "@/actions/snapshot-restore";
import { captureSnapshot as captureSnapshotAction } from "@/actions/snapshot-capture";

import SelectionList, { SelectionListItem } from "@/components/SelectionList";
import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import { useContextMenu } from "@/components/ContextMenu";
import TesselWindow from "@/components/Tessel/TesselWindow";
import Button from "@/components/Button";

import {
  snapshotIdsSelector,
  snapshotNameFromSnapshotIdSelector,
} from "@/services/snapshots/selectors/snapshots";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import styles from "./SnapshotsWindow.module.css";

const SnapshotsWindow: React.FC = () => {
  const captureSnapshot = useAction(captureSnapshotAction);
  const isActive = useSelector(isSimActiveSelector);
  const snapshotIds = useSelector(snapshotIdsSelector);
  const [selectedSnapshotId, setSelectedSnapshotId] = React.useState<
    string | null
  >(null);

  const onCreateSnapshot = React.useCallback(() => {
    captureSnapshot();
  }, [captureSnapshot]);

  const onSnapshotSelected = React.useCallback((snapshotId: string) => {
    setSelectedSnapshotId(snapshotId);
  }, []);

  const items: SelectionListItem[] = snapshotIds.map((id) => ({
    label: <SnapshotLabel snapshotId={id} />,
    value: id,
    isSelected: id === selectedSnapshotId,
  }));

  let content: React.ReactNode;
  if (!isActive) {
    content = "Snapshots can only be taken during execution.";
  } else {
    content = (
      <>
        {items.length === 0 && (
          <div>No snapshots have been captured this execution.</div>
        )}
        <SelectionList items={items} onItemSelected={onSnapshotSelected} />
        <Button onClick={onCreateSnapshot}>Create Snapshot</Button>
      </>
    );
  }

  return (
    <TesselWindow
      id="snapshot-list-window"
      title="Snapshots"
      className={styles["snapshots-window"]}
    >
      {content}
    </TesselWindow>
  );
};

const SnapshotLabel: React.FC<{ snapshotId: string }> = ({ snapshotId }) => {
  const { openContextMenu, renderContextMenu } = useContextMenu();

  const snapshotName = useSelector((state) =>
    snapshotNameFromSnapshotIdSelector(state, snapshotId)
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      openContextMenu(e);
    },
    [openContextMenu]
  );

  return (
    <div className={styles["snapshot-item"]} onContextMenu={onContextMenu}>
      {snapshotName}
      {renderContextMenu(<SnapshotContextMenu snapshotId={snapshotId} />)}
    </div>
  );
};

const SnapshotContextMenu: React.FC<{ snapshotId: string }> = ({
  snapshotId,
}) => {
  const dispatch = useDispatch();
  const onRestoreSnapshot = React.useCallback(() => {
    dispatch(restoreSnapshot(snapshotId));
  }, [dispatch, snapshotId]);

  return (
    <Menu>
      <MenuItem onClick={onRestoreSnapshot}>Revert Sim to Snapshot</MenuItem>
    </Menu>
  );
};

export default SnapshotsWindow;
