import * as React from "react";
import { Menu, MenuItem } from "@blueprintjs/core";

import { keyboardCommandModifier } from "@/runtime-env";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { canRedoSelector, canUndoSelector } from "@/undo/selectors";

import { undo } from "@/actions/undo";
import { redo } from "@/actions/redo";

const EditMenu: React.FC = () => {
  const canUndo = useSelector(canUndoSelector);
  const onUndo = useAction(undo);
  const canRedo = useSelector(canRedoSelector);
  const onRedo = useAction(redo);

  return (
    <Menu>
      <MenuItem
        icon="undo"
        text="Undo"
        label={`${keyboardCommandModifier}+z`}
        disabled={!canUndo}
        onClick={onUndo}
      />
      <MenuItem
        icon="redo"
        text="Redo"
        label={`${keyboardCommandModifier}+shift+z`}
        disabled={!canRedo}
        onClick={onRedo}
      />
    </Menu>
  );
};

export default EditMenu;
