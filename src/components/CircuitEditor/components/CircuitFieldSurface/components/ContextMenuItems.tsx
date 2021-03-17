import * as React from "react";

import { keyboardCommandModifier } from "@/runtime-env";
import { Point } from "@/geometry";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";
import { canPasteSelector } from "@/services/clipboard/selectors/clipboard";

import { paste } from "@/actions/clipboard-paste";
import { selectionAlignToGrid } from "@/actions/selection-align-to-grid";
import { deleteSelection } from "@/actions/selection-delete";
import { copySelection } from "@/actions/selection-copy";

import MenuItem from "@/components/Menus/MenuItem";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";

export interface ContextMenuItemsProps {
  fieldPosition: Point;
}
const ContextMenuItems: React.FC<ContextMenuItemsProps> = ({
  fieldPosition,
}) => {
  const onAlignToGrid = useAction(selectionAlignToGrid);

  const canCopy = useSelector(selectedNodeIdsSelector).length > 0;
  const onCopy = useAction(copySelection);
  const canPaste = useSelector(canPasteSelector);
  const onPaste = useAction(paste, { pastePosition: fieldPosition });

  const onDelete = useAction(deleteSelection);

  return (
    <>
      <MenuItem onClick={onAlignToGrid}>Align Selection To Grid</MenuItem>
      <DividerMenuItem />
      <MenuItem
        disabled={!canCopy}
        secondary={`${keyboardCommandModifier}+c`}
        onClick={onCopy}
      >
        Copy
      </MenuItem>
      <MenuItem
        disabled={!canPaste}
        secondary={`${keyboardCommandModifier}+v`}
        onClick={onPaste}
      >
        Paste
      </MenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onDelete}>Delete Selected</MenuItem>
    </>
  );
};

export default ContextMenuItems;
