import * as React from "react";
import uniq from "lodash/uniq";
import { useDrag } from "react-dnd";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";

import { ElementDefinition } from "@/elements/types";
import { getNodeVisualElement } from "@/elements/visuals";

import {
  elementDefinitionFromTypeSelector,
  elementDefinitionsSelector,
} from "@/services/element-types/selectors/element-types";

import { newElementDragObject } from "@/components/CircuitEditor/drag-items/new-element";
import TesselWindow from "@/components/Tessel/TesselWindow";
import Tooltip from "@/components/Tooltip";

import styles from "./ElementTrayWindow.module.css";

const CategoryNames: Record<ElementDefinition["category"], string> = {
  "input-output": "I/O",
  "integrated-circuit": "Integrated Circuits",
  logic: "Logic",
};

const ElementTrayWindow: React.FC = () => {
  const elementDefinitions = useSelector(elementDefinitionsSelector);
  const categories = uniq(elementDefinitions.map((x) => x.category));
  const [search, setSearch] = React.useState("");
  const onSearchChanged = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value.toLowerCase());
    },
    []
  );

  return (
    <TesselWindow
      id="element-tray"
      title="Elements"
      className={styles["element-tray"]}
    >
      <div>
        <input
          className={styles["element-tray-search"]}
          type="text"
          value={search}
          onChange={onSearchChanged}
          placeholder="Search"
        />
      </div>
      <div className={styles["element-tray-element-container"]}>
        <ul className={styles["element-tray-element-list"]}>
          {categories.map((category) => (
            <TrayCategory key={category} category={category} search={search} />
          ))}
        </ul>
      </div>
    </TesselWindow>
  );
};
export default ElementTrayWindow;

interface TrayCategoryProps {
  category: ElementDefinition["category"];
  search: string;
}

const TrayCategory: React.FC<TrayCategoryProps> = ({ category, search }) => {
  const elementDefinitions = useSelector(elementDefinitionsSelector);
  const defInCategory = elementDefinitions.filter(
    (def) => def.category === category
  );

  function shouldShowElement(def: ElementDefinition) {
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

  const elements = defInCategory.filter(shouldShowElement).map((def) => {
    return <TrayElement key={def.type} elementType={def.type} />;
  });

  if (elements.length === 0) {
    return null;
  }

  return (
    <>
      <li className={styles["element-tray-category"]}>
        {CategoryNames[category]}
      </li>
      {elements}
    </>
  );
};

interface TrayElementProps {
  elementType: string;
}
const TrayElement: React.FC<TrayElementProps> = ({ elementType }) => {
  const [liRef, setLiRef] = React.useState<HTMLElement | null>(null);
  const def = useSelector((state) =>
    elementDefinitionFromTypeSelector(state, elementType)
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
    item: newElementDragObject(elementType),
  });

  let elementTrayVisual: JSX.Element;
  let displayName = elementType;
  let viewBox = "0 0 50 50";
  if (def) {
    const { trayComponent, hitRect } = def.visual;
    if (trayComponent) {
      const TrayComponent = trayComponent;
      elementTrayVisual = <TrayComponent />;
    } else {
      elementTrayVisual = getNodeVisualElement(
        undefined,
        [],
        undefined,
        def.visual
      );
      viewBox = `${hitRect.p1.x} ${hitRect.p1.y} ${hitRect.p2.x} ${hitRect.p2.y}`;
    }
    displayName = def.displayName;
  } else {
    elementTrayVisual = <NodeTrayErrorComponent />;
  }

  return (
    <li
      id={`element-tray--element-${elementType}`}
      ref={(ref) => {
        setLiRef(ref);
        dragRef(ref);
      }}
      className={styles["element-tray-item"]}
      onClick={onShowTooltip}
      onMouseOut={onHideTooltip}
    >
      <Tooltip placement="top" isOpen={showTooltip} anchorEl={liRef}>
        Click and drag to create a new circuit element.
      </Tooltip>
      <span className={styles["element-tray-item-preview"]}>
        <svg width={30} height={30} viewBox={viewBox}>
          {elementTrayVisual}
        </svg>
      </span>
      <span className={interaction["text-unselectable"]}>{displayName}</span>
    </li>
  );
};

const NodeTrayErrorComponent = () => (
  <rect fill="red" x1={0} y1={0} x2={50} y2={50} />
);
