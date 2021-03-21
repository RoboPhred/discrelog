import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";
import flex from "@/styles/flex.module.css";

import { rearrangeLayout } from "@/actions/layout-rearrange";
import { circuitEditorDragAbort } from "@/actions/circuit-editor-drag-abort";

import useSelector from "@/hooks/useSelector";
import { useNativeEvent } from "@/hooks/useNativeEvent";

import Tessel, { TesselValue, TesselWindowItem } from "@/components/Tessel";

import { layoutSelector } from "@/services/ui-layout/selectors/layout";

import ProjectEditorTitleBar from "./components/ProjectEditorTitleBar";

import CircuitFieldWindow from "./windows/CircuitEditorWindow";
import CircuitsTreeWindow from "./windows/CircuitsTreeWindow";
import ElementTrayWindow from "./windows/ElementTrayWindow";

const WindowsById: Record<string, React.ComponentType<any>> = {
  "element-tray": ElementTrayWindow,
  "circuit-field": CircuitFieldWindow,
  "circuits-list": CircuitsTreeWindow,
};

function renderWindow(window: TesselWindowItem): React.ReactElement | null {
  const Component = WindowsById[window.windowId];
  if (!Component) {
    return null;
  }
  return <Component {...window.windowProps} />;
}

const ProjectEditorPage: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(layoutSelector);
  const onLayoutChange = React.useCallback(
    (layout: TesselValue) => {
      dispatch(rearrangeLayout(layout));
    },
    [dispatch]
  );

  // A bit hacky, but we need some singleton component to install a global check
  // to look for drag cancellations when we mouse up outside of any circuit editor.
  const onMouseUp = React.useCallback(
    (e: MouseEvent) => {
      let element: Element | null = e.target as Element;
      while (element != null) {
        if (element.classList.contains("circuit-editor")) {
          return;
        }
        element = element.parentElement;
      }
      dispatch(circuitEditorDragAbort());
    },
    [dispatch]
  );

  useNativeEvent({ current: document.body }, "mouseup", onMouseUp);

  return (
    <div className={cls(sizing["fill-parent"], flex["flex-column"])}>
      <ProjectEditorTitleBar className={flex["flexitem-fix"]} />
      <div className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}>
        <Tessel
          className={cls("project-editor", sizing["fill-parent"])}
          rootItem={layout}
          onLayoutChange={onLayoutChange}
          renderWindow={renderWindow}
        />
      </div>
    </div>
  );
};

export default ProjectEditorPage;
