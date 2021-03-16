import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";

import useSelector from "@/hooks/useSelector";

import { deleteCircuit } from "@/actions/circuit-delete";
import { viewCircuit } from "@/actions/view-circuit";
import { addCircuit } from "@/actions/circuit-add";
import { renameCircuit } from "@/actions/circuit-rename";

import {
  circuitNameFromIdSelector,
  circuitNamesByIdSelector,
} from "@/services/circuits/selectors/circuits";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { useContextMenu } from "@/components/ContextMenu";
import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";
import SelectionList, { SelectionListItem } from "@/components/SelectionList";
import EditableText from "@/components/EditableText";
import TesselWindow from "@/components/Tessel/TesselWindow";

import styles from "./CircuitsTreeWindow.module.css";

const CircuitsTreeWindow: React.FC = () => {
  const dispatch = useDispatch();

  const circuitNamesById = useSelector(circuitNamesByIdSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const onCircuitSelected = React.useCallback(
    (circuitId: string) => {
      dispatch(viewCircuit(circuitId));
    },
    [dispatch]
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      openContextMenu(e);
    },
    [openContextMenu]
  );

  const listItems: SelectionListItem[] = React.useMemo(
    () =>
      Object.keys(circuitNamesById).map((circuitId) => {
        return {
          value: circuitId,
          label: <CircuitTreeNodeCircuitLabel circuitId={circuitId} />,
        };
      }),
    [circuitNamesById]
  );

  return (
    <TesselWindow title="Circuits" className={cls(styles.circuitstree)}>
      <div className={sizing["fill-parent"]} onContextMenu={onContextMenu}>
        <SelectionList
          className={sizing["fill-parent"]}
          items={listItems}
          onItemSelected={onCircuitSelected}
        />
      </div>
      {renderContextMenu(<CircuitTreeContextMenu />)}
    </TesselWindow>
  );
};

export default CircuitsTreeWindow;

interface CircuitTreeNodeLabelProps {
  circuitId: string;
}

const CircuitTreeNodeCircuitLabel: React.FC<CircuitTreeNodeLabelProps> = ({
  circuitId,
}) => {
  const dispatch = useDispatch();
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );
  const [isRenaming, setIsRenaming] = React.useState(false);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const onRequestRename = React.useCallback(() => {
    if (circuitId === ROOT_CIRCUIT_ID) {
      return;
    }
    setIsRenaming(true);
  }, [circuitId]);

  const onCancelRename = React.useCallback(() => {
    setIsRenaming(false);
  }, []);

  const onRename = React.useCallback(
    (newName) => {
      dispatch(renameCircuit(circuitId, newName));
      setIsRenaming(false);
    },
    [circuitId, dispatch]
  );

  const onOpenNewWindow = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(viewCircuit(circuitId, null, { newWindow: true }));
    },
    [circuitId, dispatch]
  );

  const onDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(deleteCircuit(circuitId));
    },
    [dispatch, circuitId]
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
    <div
      style={{ width: "100%" }}
      onContextMenu={onContextMenu}
      onDoubleClick={onRequestRename}
    >
      <EditableText
        defaultValue={circuitName}
        isEditing={isRenaming}
        onRequestEdit={onRequestRename}
        onCommit={onRename}
        onCancel={onCancelRename}
      />
      {renderContextMenu(
        <Menu>
          {circuitId !== ROOT_CIRCUIT_ID && (
            <>
              <MenuItem onClick={onRequestRename}>Rename Circuit</MenuItem>
              <DividerMenuItem />
            </>
          )}
          <MenuItem onClick={onOpenNewWindow}>Open in New Window</MenuItem>
          {circuitId !== ROOT_CIRCUIT_ID && (
            <>
              <DividerMenuItem />
              <MenuItem onClick={onDelete}>Delete Circuit</MenuItem>
            </>
          )}
        </Menu>
      )}
    </div>
  );
};

const CircuitTreeContextMenu: React.FC = () => {
  const dispatch = useDispatch();
  const onNewCircuit = React.useCallback(() => {
    dispatch(addCircuit());
  }, [dispatch]);

  return (
    <Menu>
      <MenuItem onClick={onNewCircuit}>New Circuit</MenuItem>
    </Menu>
  );
};
