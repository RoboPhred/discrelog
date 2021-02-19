import * as React from "react";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { MosaicWindow } from "react-mosaic-component";

import { EditableText, MenuDivider } from "@blueprintjs/core";

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
import {
  circuitNameFromIdSelector,
  circuitNamesByIdSelector,
} from "@/services/circuits/selectors/circuits";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { editCircuit } from "@/actions/circuit-edit";
import { addCircuit } from "@/actions/circuit-add";
import { renameCircuit } from "@/actions/circuit-rename";

import { WindowProps } from "../window-props";

import styles from "./CircuitsTreeWindow.module.css";

const CircuitsTreeWindow: React.FC<WindowProps> = ({ path }) => {
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
    <MosaicWindow path={path} title="Circuits">
      <div className={styles.circuitstree} onContextMenu={onContextMenu}>
        <Tree contents={treeItems} onNodeClick={onNodeClick} />
      </div>
    </MosaicWindow>
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

  const onStartRename = React.useCallback(() => {
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
    [circuitId]
  );

  const onDelete = React.useCallback(() => {
    dispatch(deleteCircuit(circuitId));
  }, [dispatch, circuitId]);

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (circuitId === ROOT_CIRCUIT_ID) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      ContextMenu.show(
        <Menu>
          <MenuItem text="Rename Circuit" onClick={onStartRename} />
          <MenuDivider />
          <MenuItem text="Delete Circuit" onClick={onDelete} />
        </Menu>,
        { left: e.pageX, top: e.pageY }
      );
    },
    []
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
      </div>
    );
  }
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
