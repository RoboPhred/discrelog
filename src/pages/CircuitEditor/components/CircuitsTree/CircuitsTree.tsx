import * as React from "react";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";

import {
  Tree,
  ITreeNode,
  Menu,
  MenuItem,
  ContextMenu,
} from "@blueprintjs/core";

import useSelector from "@/hooks/useSelector";

import { deleteCircuit } from "@/actions/circuit-delete";

import { editingCircuitIdSelector } from "@/services/circuit-editor-ui/selectors/circuit";
import { circuitNamesByIdSelector } from "@/services/circuits/selectors/circuits";
import { editCircuit } from "@/actions/circuit-edit";
import { addCircuit } from "@/actions/circuit-add";

import styles from "./CircuitsTree.module.css";

const CircuitsTree: React.FC = () => {
  const dispatch = useDispatch();
  const editingCircuitId = useSelector(editingCircuitIdSelector);
  const circuitNamesById = useSelector(circuitNamesByIdSelector);

  const onNodeClick = React.useCallback(
    (node: ITreeNode) => {
      dispatch(editCircuit(node.id as string));
    },
    [dispatch]
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      ContextMenu.show(<CircuitTreeContextMenu dispatch={dispatch} />, {
        left: e.pageX,
        top: e.pageY,
      });
    },
    [dispatch]
  );

  const onNodeContextMenu = React.useCallback(
    (node: ITreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
      if (node.id === "root") {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      ContextMenu.show(
        <CircuitTreeNodeContextMenu
          dispatch={dispatch}
          circuitId={node.id as string}
        />,
        { left: e.pageX, top: e.pageY }
      );
    },
    []
  );

  const treeItems: ITreeNode[] = React.useMemo(
    () =>
      Object.keys(circuitNamesById).map((circuitId) => ({
        id: circuitId,
        label: circuitNamesById[circuitId],
        isSelected: circuitId === editingCircuitId,
      })),
    [circuitNamesById, editingCircuitId]
  );

  return (
    <div className={styles.circuitstree} onContextMenu={onContextMenu}>
      <Tree
        contents={treeItems}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
      />
    </div>
  );
};

interface CircuitTreeNodeContextMenu {
  circuitId: string;
  // Dispatch must be passed in externally, as ContextMenu.show starts
  //  a new redux tree and has no provider.
  dispatch: Dispatch<any>;
}
const CircuitTreeNodeContextMenu: React.FC<CircuitTreeNodeContextMenu> = ({
  circuitId,
  dispatch,
}) => {
  const onDelete = React.useCallback(() => {
    dispatch(deleteCircuit(circuitId));
  }, [dispatch, circuitId]);
  return (
    <Menu>
      <MenuItem text="Delete Circuit" onClick={onDelete} />
    </Menu>
  );
};

interface CircuitTreeContextMenuProps {
  // Dispatch must be passed in externally, as ContextMenu.show starts
  //  a new redux tree and has no provider.
  dispatch: Dispatch<any>;
}
const CircuitTreeContextMenu: React.FC<CircuitTreeContextMenuProps> = ({
  dispatch,
}) => {
  const onNewCircuit = React.useCallback(() => {
    dispatch(addCircuit());
  }, [dispatch]);

  return (
    <Menu>
      <MenuItem text="New Circuit" onClick={onNewCircuit} />
    </Menu>
  );
};

export default CircuitsTree;
