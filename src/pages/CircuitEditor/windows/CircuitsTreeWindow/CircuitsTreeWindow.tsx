import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";

import useSelector from "@/hooks/useSelector";

import { deleteCircuit } from "@/actions/circuit-delete";
import { editCircuit } from "@/actions/circuit-edit";
import { addCircuit } from "@/actions/circuit-add";
import { renameCircuit } from "@/actions/circuit-rename";

import { editingCircuitIdSelector } from "@/services/circuit-editor-view/selectors/circuit";
import {
  circuitNameFromIdSelector,
  circuitNamesByIdSelector,
} from "@/services/circuits/selectors/circuits";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { useContextMenu } from "@/components/ContextMenu";
import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import MenuDivider from "@/components/Menus/MenuDivider";
import SelectionList, { SelectionListItem } from "@/components/SelectionList";
import EditableText from "@/components/EditableText";

import { WindowProps } from "../window-props";

import styles from "./CircuitsTreeWindow.module.css";

const CircuitsTreeWindow: React.FC<WindowProps> = ({ className }) => {
  const dispatch = useDispatch();

  const editingCircuitId = useSelector(editingCircuitIdSelector);
  const circuitNamesById = useSelector(circuitNamesByIdSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const onCircuitSelected = React.useCallback(
    (circuitId: string) => {
      dispatch(editCircuit(circuitId));
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
          isSelected: circuitId === editingCircuitId,
        };
      }),
    [circuitNamesById, editingCircuitId]
  );

  return (
    <div
      className={cls(styles.circuitstree, className)}
      onContextMenu={onContextMenu}
    >
      <SelectionList
        className={sizing["fill-parent"]}
        items={listItems}
        onItemSelected={onCircuitSelected}
      />
      {renderContextMenu(<CircuitTreeContextMenu />)}
    </div>
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

  const onStartRename = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // We totally support renaming the root, but the root is special
      // in that its the driving circuit.  If the user looses track of it,
      // that's a bad thing.
      // We need some icon or something on the root list item.
      if (circuitId === ROOT_CIRCUIT_ID) {
        return;
      }
      setIsRenaming(true);
    },
    [circuitId]
  );

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

  const onDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(deleteCircuit(circuitId));
    },
    [dispatch, circuitId]
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (circuitId === ROOT_CIRCUIT_ID) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      openContextMenu(e);
    },
    [circuitId, openContextMenu]
  );

  if (isRenaming) {
    return (
      <EditableText
        isEditing={true}
        defaultValue={circuitName}
        onConfirm={onRename}
        onCancel={onCancelRename}
      />
    );
  } else {
    return (
      <div
        style={{ width: "100%" }}
        onContextMenu={onContextMenu}
        onDoubleClick={onStartRename}
      >
        {circuitName}
        {renderContextMenu(
          <Menu>
            <MenuItem onClick={onStartRename}>Rename Circuit</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onDelete}>Delete Circuit</MenuItem>
          </Menu>
        )}
      </div>
    );
  }
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
