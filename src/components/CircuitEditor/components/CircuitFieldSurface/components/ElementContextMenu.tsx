import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";

import useSelector from "@/hooks/useSelector";

import { elementTypeToCircuitId } from "@/elements/definitions/integrated-circuits/utils";

import { renameElement } from "@/actions/element-rename";
import { viewCircuit } from "@/actions/view-circuit";

import {
  elementNameOrDefaultFromElementIdSelector,
  elementTypeFromElementIdSelector,
} from "@/services/circuit-graph/selectors/elements";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import Menu from "@/components/Menus/Menu";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";
import EditableTextMenuItem from "@/components/Menus/EditableTextMenuItem";
import MenuItem from "@/components/Menus/MenuItem";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ContextMenuItems from "./ContextMenuItems";

export interface NodeContextMenuProps {
  fieldPosition: Point;
  elementId: string;
}

const ElementContextMenu: React.FC<NodeContextMenuProps> = ({
  elementId,
  fieldPosition,
}) => {
  const dispatch = useDispatch();

  const { elementIdPath } = useCircuitEditor();

  const isSimActive = useSelector(isSimActiveSelector);

  const elementName = useSelector((state) =>
    elementNameOrDefaultFromElementIdSelector(state, elementId)
  );
  const elementType = useSelector((state) =>
    elementTypeFromElementIdSelector(state, elementId)
  );
  const elementCircuitId = elementType
    ? elementTypeToCircuitId(elementType)
    : null;

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
      dispatch(renameElement(elementId, value));
    },
    [dispatch, elementId]
  );

  const onOpenCircuitInNewWindow = React.useCallback(() => {
    if (!elementCircuitId) {
      return;
    }
    dispatch(
      viewCircuit(elementCircuitId, [...elementIdPath, elementId], {
        newWindow: true,
      })
    );
  }, [elementIdPath, dispatch, elementCircuitId, elementId]);

  if (isSimActive) {
    return null;
  }

  return (
    <Menu>
      <EditableTextMenuItem
        defaultValue={elementName ?? "<unknown>"}
        label={<span style={{ fontWeight: 600 }}>{elementName}</span>}
        isEditing={isRenaming}
        onRequestEdit={onRename}
        onCommit={onRenameCommit}
        onCancel={onRenameCancel}
      />
      <DividerMenuItem />
      {elementCircuitId && (
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

export default ElementContextMenu;
