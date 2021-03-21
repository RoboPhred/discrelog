import * as React from "react";

import { keyboardCommandModifier } from "@/runtime-env";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { canRedoSelector, canUndoSelector } from "@/undo/selectors";

import { selectedElementIdsSelector } from "@/services/selection/selectors/selection";
import { canPasteSelector } from "@/services/clipboard/selectors/clipboard";

import { undo } from "@/actions/undo";
import { redo } from "@/actions/redo";
import { copySelection } from "@/actions/selection-copy";
import { paste } from "@/actions/clipboard-paste";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";

const EditMenu: React.FC = () => {
  const canUndo = useSelector(canUndoSelector);
  const onUndo = useAction(undo);
  const canRedo = useSelector(canRedoSelector);
  const onRedo = useAction(redo);

  const canCopy = useSelector(selectedElementIdsSelector).length > 0;
  const onCopy = useAction(copySelection);
  const canPaste = useSelector(canPasteSelector);
  const onPaste = useAction(paste);

  return (
    <Menu>
      <MenuItem
        disabled={!canUndo}
        secondary={`${keyboardCommandModifier}+z`}
        onClick={onUndo}
      >
        Undo
      </MenuItem>
      <MenuItem
        disabled={!canRedo}
        secondary={`${keyboardCommandModifier}+shift+z`}
        onClick={onRedo}
      >
        Redo
      </MenuItem>
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
    </Menu>
  );
};

export default EditMenu;
