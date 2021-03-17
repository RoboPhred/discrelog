import * as React from "react";

import { cls } from "@/utils";

import { useNativeEvent } from "@/hooks/useNativeEvent";
import { useAction } from "@/hooks/useAction";

import flex from "@/styles/flex.module.css";
import sizing from "@/styles/sizing.module.css";

import Routes from "@/router";

import { circuitEditorDragAbort } from "@/actions/circuit-editor-drag-abort";

import TitleBar from "../TitleBar";
import DialogManager from "../DialogManager";

const App: React.FC = () => {
  // A bit hacky, but we need some singleton component to install a global check
  // to look for drag cancellations when we mouse up outside of any circuit editor.
  const dragAbort = useAction(circuitEditorDragAbort);
  const onMouseUp = React.useCallback(
    (e: MouseEvent) => {
      let element: Element | null = e.target as Element;
      while (element != null) {
        if (element.classList.contains("circuit-editor")) {
          return;
        }
        element = element.parentElement;
      }
      dragAbort();
    },
    [dragAbort]
  );

  useNativeEvent({ current: document.body }, "mouseup", onMouseUp);

  return (
    <div className={cls(sizing["fill-parent"], flex["flex-column"])}>
      <TitleBar className={flex["flexitem-fix"]} />
      <div className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}>
        <Routes />
      </div>
      <DialogManager />
    </div>
  );
};

export default App;
