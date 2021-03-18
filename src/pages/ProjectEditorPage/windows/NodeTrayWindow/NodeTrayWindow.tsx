import * as React from "react";
import uniq from "lodash/uniq";
import { useDrag } from "react-dnd";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";

import { NodeDefinition } from "@/nodes/types";
import { getNodeVisualElement } from "@/nodes/visuals";

import {
  nodeDefinitionFromTypeSelector,
  nodeDefinitionsSelector,
} from "@/services/node-types/selectors/node-types";

import { newNodeDragObject } from "@/components/CircuitEditor/drag-items/new-node";
import TesselWindow from "@/components/Tessel/TesselWindow";
import Tooltip from "@/components/Tooltip";

import styles from "./NodeTrayWindow.module.css";

const CategoryNames: Record<NodeDefinition["category"], string> = {
  "input-output": "I/O",
  "integrated-circuit": "Integrated Circuits",
  logic: "Logic",
};

const NodeTrayWindow: React.FC = () => {
  const nodeDefinitions = useSelector(nodeDefinitionsSelector);
  const categories = uniq(nodeDefinitions.map((x) => x.category));
  const [search, setSearch] = React.useState("");
  const onSearchChanged = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value.toLowerCase());
    },
    []
  );

  return (
    <TesselWindow
      id="node-tray"
      title="Elements"
      className={styles["node-tray"]}
    >
      <div>
        <input
          className={styles["node-tray-search"]}
          type="text"
          value={search}
          onChange={onSearchChanged}
          placeholder="Search"
        />
      </div>
      <div className={styles["node-tray-element-container"]}>
        <ul className={styles["node-tray-element-list"]}>
          {categories.map((category) => (
            <TrayCategory key={category} category={category} search={search} />
          ))}
        </ul>
      </div>
    </TesselWindow>
  );
};
export default NodeTrayWindow;

interface TrayCategoryProps {
  category: NodeDefinition["category"];
  search: string;
}

const TrayCategory: React.FC<TrayCategoryProps> = ({ category, search }) => {
  const nodeDefinitions = useSelector(nodeDefinitionsSelector);
  const defInCategory = nodeDefinitions.filter(
    (def) => def.category === category
  );

  function shouldShowNode(def: NodeDefinition) {
    if (def.category !== category) {
      return false;
    }

    if (
      search !== null &&
      def.displayName.toLowerCase().indexOf(search) === -1
    ) {
      return false;
    }

    return true;
  }

  const nodes = defInCategory.filter(shouldShowNode).map((def) => {
    return <TrayNode key={def.type} nodeType={def.type} />;
  });

  if (nodes.length === 0) {
    return null;
  }

  return (
    <>
      <li className={styles["node-tray-category"]}>
        {CategoryNames[category]}
      </li>
      {nodes}
    </>
  );
};

interface TrayNodeProps {
  nodeType: string;
}
const TrayNode: React.FC<TrayNodeProps> = ({ nodeType }) => {
  const [liRef, setLiRef] = React.useState<HTMLElement | null>(null);
  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

  const [showTooltip, setShowTooltip] = React.useState(false);
  const onShowTooltip = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowTooltip(true);
  }, []);
  const onHideTooltip = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== liRef) {
        return;
      }
      setShowTooltip(false);
    },
    [liRef]
  );

  const [, dragRef] = useDrag({
    item: newNodeDragObject(nodeType),
  });

  let nodeTrayVisual: JSX.Element;
  let displayName = nodeType;
  let viewBox = "0 0 50 50";
  if (def) {
    const { trayComponent, hitRect } = def.visual;
    if (trayComponent) {
      const TrayComponent = trayComponent;
      nodeTrayVisual = <TrayComponent />;
    } else {
      nodeTrayVisual = getNodeVisualElement(
        undefined,
        [],
        undefined,
        def.visual
      );
      viewBox = `${hitRect.p1.x} ${hitRect.p1.y} ${hitRect.p2.x} ${hitRect.p2.y}`;
    }
    displayName = def.displayName;
  } else {
    nodeTrayVisual = <NodeTrayErrorComponent />;
  }

  return (
    <li
      id={`node-tray--node-${nodeType}`}
      ref={(ref) => {
        setLiRef(ref);
        dragRef(ref);
      }}
      className={styles["node-tray-item"]}
      onClick={onShowTooltip}
      onMouseOut={onHideTooltip}
    >
      <Tooltip placement="top" isOpen={showTooltip} anchorEl={liRef}>
        Click and drag to create a new circuit element.
      </Tooltip>
      <span className={styles["node-tray-item-preview"]}>
        <svg width={30} height={30} viewBox={viewBox}>
          {nodeTrayVisual}
        </svg>
      </span>
      <span className={interaction["text-unselectable"]}>{displayName}</span>
    </li>
  );
};

const NodeTrayErrorComponent = () => (
  <rect fill="red" x1={0} y1={0} x2={50} y2={50} />
);
