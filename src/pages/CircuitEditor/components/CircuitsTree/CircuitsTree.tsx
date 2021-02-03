import * as React from "react";
import { useDispatch } from "react-redux";

import {
  Tree,
  ITreeNode,
  Menu,
  MenuItem,
  ContextMenu,
} from "@blueprintjs/core";

import { Point } from "@/geometry";
import useSelector from "@/hooks/useSelector";

import { editingCircuitIdSelector } from "@/services/circuit-editor-ui/selectors/circuit";
import { circuitNamesByIdSelector } from "@/services/circuits/selectors/circuits";
import { editCircuit } from "@/actions/circuit-edit";
import { newCircuit } from "@/actions/circuit-new";

import styles from "./CircuitsTree.module.css";
import { Dispatch } from "redux";

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
      ContextMenu.show(<CircuitTreeContextMenu dispatch={dispatch} />, {
        left: e.pageX,
        top: e.pageY,
      });
    },
    [dispatch]
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
      <Tree contents={treeItems} onNodeClick={onNodeClick} />
    </div>
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
    dispatch(newCircuit());
  }, [dispatch]);

  return (
    <Menu>
      <MenuItem text="New Circuit" onClick={onNewCircuit} />
    </Menu>
  );
};

export default CircuitsTree;
