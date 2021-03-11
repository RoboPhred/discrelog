import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { renameNode } from "@/actions/node-rename";

import {
  nodeNameOrDefaultFromNodeIdSelector,
  nodeTypeFromNodeIdSelector,
} from "@/services/node-graph/selectors/nodes";

import Menu from "@/components/Menus/Menu";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";
import EditableTextMenuItem from "@/components/Menus/EditableTextMenuItem";

import ContextMenuItems from "../../ContextMenuItems";
import { nodeTypeToCircuitId } from "@/nodes/definitions/integrated-circuits/utils";
import { viewCircuit } from "@/actions/view-circuit";
import { useCircuitField } from "@/components/CircuitField/circuit-field-context";
import MenuItem from "@/components/Menus/MenuItem";

export interface NodeContextMenuProps {
  nodeId: string;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ nodeId }) => {
  const dispatch = useDispatch();

  const { circuitNodePath } = useCircuitField();

  const nodeName = useSelector((state) =>
    nodeNameOrDefaultFromNodeIdSelector(state, nodeId)
  );
  const nodeType = useSelector((state) =>
    nodeTypeFromNodeIdSelector(state, nodeId)
  );
  const nodeCircuitId = nodeType ? nodeTypeToCircuitId(nodeType) : null;

  const [isRenaming, setIsRenaming] = React.useState(false);
  const onRename = React.useCallback(() => {
    setIsRenaming(true);
  }, []);
  const onRenameCancel = React.useCallback(() => {
    setIsRenaming(false);
  }, []);
  const onRenameCommit = React.useCallback(
    (value: string) => {
      setIsRenaming(false);
      dispatch(renameNode(nodeId, value));
    },
    [dispatch, nodeId]
  );

  const onOpenCircuitInNewWindow = React.useCallback(() => {
    if (!nodeCircuitId) {
      return;
    }
    dispatch(
      viewCircuit(nodeCircuitId, [...circuitNodePath, nodeId], {
        newWindow: true,
      })
    );
  }, [circuitNodePath, dispatch, nodeCircuitId, nodeId]);

  return (
    <Menu>
      <EditableTextMenuItem
        defaultValue={nodeName ?? "<unknown>"}
        label={<span style={{ fontWeight: "bold" }}>{nodeName}</span>}
        isEditing={isRenaming}
        onRequestEdit={onRename}
        onCommit={onRenameCommit}
        onCancel={onRenameCancel}
      />
      <DividerMenuItem />
      {nodeCircuitId && (
        <>
          <MenuItem onClick={onOpenCircuitInNewWindow}>
            Open in New Window
          </MenuItem>
          <DividerMenuItem />
        </>
      )}
      <ContextMenuItems />
    </Menu>
  );
};

export default NodeContextMenu;
