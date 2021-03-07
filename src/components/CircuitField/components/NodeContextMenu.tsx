import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { renameNode } from "@/actions/node-rename";

import { nodeNameOrDefaultFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import Menu from "@/components/Menus/Menu";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";
import EditableTextMenuItem from "@/components/Menus/EditableTextMenuItem";

import ContextMenuItems from "./ContextMenuItems";

export interface NodeContextMenuProps {
  nodeId: string;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ nodeId }) => {
  const dispatch = useDispatch();

  const nodeName = useSelector((state) =>
    nodeNameOrDefaultFromNodeIdSelector(state, nodeId)
  );
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
      <ContextMenuItems />
    </Menu>
  );
};

export default NodeContextMenu;
