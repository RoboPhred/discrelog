import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { peekSnapshot } from "@/actions/snapshot-peek";
import { restoreSnapshot } from "@/actions/snapshot-restore";
import { captureSnapshot } from "@/actions/snapshot-capture";

import SelectionList, { SelectionListItem } from "@/components/SelectionList";
import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import { useContextMenu } from "@/components/ContextMenu";
import TesselWindow from "@/components/Tessel/TesselWindow";
import Button from "@/components/Button";

import {
  peekSnapshotIdSelector,
  snapshotIdsSelector,
  snapshotNameFromSnapshotIdSelector,
} from "@/services/snapshots/selectors/snapshots";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import styles from "./SnapshotsWindow.module.css";

const SnapshotsWindow: React.FC = () => {
  const isActive = useSelector(isSimActiveSelector);
  const dispatch = useDispatch();
  const snapshotIds = useSelector(snapshotIdsSelector);
  const peekSnapshotId = useSelector(peekSnapshotIdSelector);

  const onCreateSnapshot = React.useCallback(() => {
    dispatch(captureSnapshot());
  }, [dispatch]);

  const onSnapshotSelected = React.useCallback(
    (snapshotId: string) => {
      dispatch(peekSnapshot(snapshotId));
    },
    [dispatch]
  );

  const items: SelectionListItem[] = snapshotIds.map((id) => ({
    label: <SnapshotLabel snapshotId={id} />,
    value: id,
    isSelected: id === peekSnapshotId,
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
