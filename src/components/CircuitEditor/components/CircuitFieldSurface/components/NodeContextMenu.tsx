import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";

import useSelector from "@/hooks/useSelector";

import { nodeTypeToCircuitId } from "@/nodes/definitions/integrated-circuits/utils";

import { renameNode } from "@/actions/node-rename";
import { viewCircuit } from "@/actions/view-circuit";

import {
  nodeNameOrDefaultFromNodeIdSelector,
  nodeTypeFromNodeIdSelector,
} from "@/services/node-graph/selectors/nodes";

import Menu from "@/components/Menus/Menu";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";
import EditableTextMenuItem from "@/components/Menus/EditableTextMenuItem";
import MenuItem from "@/components/Menus/MenuItem";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ContextMenuItems from "./ContextMenuItems";

export interface NodeContextMenuProps {
  fieldPosition: Point;
  nodeId: string;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  fieldPosition,
}) => {
  const dispatch = useDispatch();

  const { circuitNodeIdPath } = useCircuitEditor();

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
      viewCircuit(nodeCircuitId, [...circuitNodeIdPath, nodeId], {
        newWindow: true,
      })
    );
  }, [circuitNodeIdPath, dispatch, nodeCircuitId, nodeId]);

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
      <ContextMenuItems fieldPosition={fieldPosition} />
    </Menu>
  );
};

export default NodeContextMenu;
