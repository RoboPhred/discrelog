import * as React from "react";
import last from "lodash/last";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import { elementTypeToCircuitId } from "@/elements/definitions/integrated-circuits/utils";

import { viewCircuit } from "@/actions/view-circuit";

import {
  elementNameOrDefaultFromElementIdSelector,
  elementTypeFromElementIdSelector,
} from "@/services/circuit-graph/selectors/elements";
import { circuitNameFromIdSelector } from "@/services/circuit-properties/selectors/circuits";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import Button from "../Button";

import styles from "./CircuitNodeBreadcrumb.module.css";

export interface CircuitNodeBreadcrumbProps {
  circuitId: string;
  elementIdPath: string[];
}
const CircuitNodeBreadcrumb: React.FC<CircuitNodeBreadcrumbProps> = ({
  circuitId,
  elementIdPath,
}) => {
  const elements: JSX.Element[] = elementIdPath.map((elementId, index) => {
    const elementPath = elementIdPath.slice(0, index + 1);
    return (
      <React.Fragment key={elementId}>
        <span>&gt;</span>
        <CircuitNodeBreadcrumbItem elementIdPath={elementPath} />
      </React.Fragment>
    );
  });

  return (
    <div
      className={cls(
        "circuit-element-breadcrumb",
        styles["circuit-element-breadcrumb"]
      )}
    >
      <CircuitNodeBreadcrumbRootItem
        circuitId={circuitId}
        elementIdPath={elementIdPath}
      />
      {elements}
    </div>
  );
};

export default CircuitNodeBreadcrumb;

interface CircuitNodeBreadcrumbRootItemProps {
  circuitId: string;
  elementIdPath: string[];
}
const CircuitNodeBreadcrumbRootItem: React.FC<CircuitNodeBreadcrumbRootItemProps> = ({
  circuitId,
  elementIdPath,
}) => {
  const dispatch = useDispatch();
  const rootCircuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, ROOT_CIRCUIT_ID)
  );
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(viewCircuit(ROOT_CIRCUIT_ID, []));
    },
    [dispatch]
  );

  return (
    <Button variant="text" size="small" onClick={onClick}>
      {elementIdPath.length === 0 ? circuitName : rootCircuitName}
    </Button>
  );
};

interface CircuitNodeBreadcrumbItemProps {
  elementIdPath: string[];
}

const CircuitNodeBreadcrumbItem: React.FC<CircuitNodeBreadcrumbItemProps> = ({
  elementIdPath: elementIdPath,
}) => {
  const dispatch = useDispatch();
  const elementId = last(elementIdPath)!;

  const elementType = useSelector((state) =>
    elementTypeFromElementIdSelector(state, elementId)
  );
  const elementName = useSelector((state) =>
    elementNameOrDefaultFromElementIdSelector(state, elementId)
  );

  const circuitId = elementType ? elementTypeToCircuitId(elementType) : null;
  const circuitName = useSelector((state) =>
    circuitId ? circuitNameFromIdSelector(state, circuitId) : null
  );

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!circuitId) {
        return;
      }
      dispatch(viewCircuit(circuitId, elementIdPath));
    },
    [circuitId, elementIdPath, dispatch]
  );

  return (
    <Button variant="text" size="small" onClick={onClick}>
      {elementName} [{circuitName}]
    </Button>
  );
};
