import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { selectionAlignToGrid } from "@/actions/selection-align-to-grid";
import { deleteSelection } from "@/actions/selection-delete";

import { nodeNameFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import MenuDivider from "@/components/Menus/MenuDivider";
import MenuEditableText from "@/components/Menus/MenuEditableText";
import { renameNode } from "@/actions/node-rename";

export interface NodeContextMenuProps {
  nodeId: string;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ nodeId }) => {
  const dispatch = useDispatch();

  const nodeName = useSelector((state) =>
    nodeNameFromNodeIdSelector(state, nodeId)
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

  const onAlignToGrid = React.useCallback(() => {
    dispatch(selectionAlignToGrid());
  }, [dispatch]);
  const onDelete = React.useCallback(() => {
    dispatch(deleteSelection());
  }, [dispatch]);

  return (
    <Menu>
      <MenuEditableText
        defaultValue={nodeName ?? "<unknown>"}
        label={<span style={{ fontWeight: "bold" }}>{nodeName}</span>}
        isEditing={isRenaming}
        onRequestEdit={onRename}
        onCommit={onRenameCommit}
        onCancel={onRenameCancel}
      />
      <MenuDivider />
      <MenuItem onClick={onAlignToGrid}>Align Selection To Grid</MenuItem>
      <MenuDivider />
      <MenuItem onClick={onDelete}>Delete Selected</MenuItem>
    </Menu>
  );
};

export default NodeContextMenu;
