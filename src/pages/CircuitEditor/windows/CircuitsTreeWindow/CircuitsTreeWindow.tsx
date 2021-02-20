import * as React from "react";
import { useDispatch } from "react-redux";

import { EditableText, Tree, ITreeNode } from "@blueprintjs/core";

import { cls } from "@/utils";

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

import { WindowProps } from "../window-props";

import styles from "./CircuitsTreeWindow.module.css";

const CircuitsTreeWindow: React.FC<WindowProps> = ({ className }) => {
  const dispatch = useDispatch();

  const editingCircuitId = useSelector(editingCircuitIdSelector);
  const circuitNamesById = useSelector(circuitNamesByIdSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const onNodeClick = React.useCallback(
    (node: ITreeNode) => {
      dispatch(editCircuit(node.id as string));
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

  const treeItems: ITreeNode[] = React.useMemo(
    () =>
      Object.keys(circuitNamesById).map((circuitId) => {
        return {
          id: circuitId,
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
      <Tree contents={treeItems} onNodeClick={onNodeClick} />
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

  const onStartRename = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsRenaming(true);
  }, []);

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
