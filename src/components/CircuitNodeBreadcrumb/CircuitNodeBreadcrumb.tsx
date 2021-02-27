import * as React from "react";
import last from "lodash/last";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import { viewCircuit } from "@/actions/circuit-view";

import {
  editingCircuitNameSelector,
  editingCircuitNodeIdPathSelector,
} from "@/services/circuit-editor-ui-viewport/selectors/circuit";
import {
  nodeNameOrDefaultFromNodeIdSelector,
  nodeTypeFromNodeIdSelector,
} from "@/services/node-graph/selectors/nodes";
import { nodeTypeToCircuitId } from "@/services/node-types/definition-sources/integrated-circuits/utils";

import styles from "./CircuitNodeBreadcrumb.module.css";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import Button from "../Button";
import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

const CircuitNodeBreadcrumb: React.FC = () => {
  const circuitNodeIdPath = useSelector(editingCircuitNodeIdPathSelector);

  const elements: JSX.Element[] = circuitNodeIdPath.map(
    (circuitNodeId, index) => {
      const elementPath = circuitNodeIdPath.slice(0, index + 1);
      return (
        <React.Fragment key={circuitNodeId}>
          <span>&gt;</span>
          <CircuitNodeBreadcrumbItem circuitNodeIdPath={elementPath} />
        </React.Fragment>
      );
    }
  );

  return (
    <div
      className={cls(
        "circuit-node-breadcrumb",
        styles["circuit-node-breadcrumb"]
      )}
    >
      <CircuitNodeBreadcrumbRootItem />
      {elements}
    </div>
  );
};

export default CircuitNodeBreadcrumb;

const CircuitNodeBreadcrumbRootItem: React.FC = () => {
  const dispatch = useDispatch();
  const circuitNodeIdPath = useSelector(editingCircuitNodeIdPathSelector);
  const rootCircuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, ROOT_CIRCUIT_ID)
  );
  const editingCircuitName = useSelector(editingCircuitNameSelector);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(viewCircuit(ROOT_CIRCUIT_ID, []));
    },
    [dispatch]
  );

  return (
    <Button onClick={onClick}>
      {circuitNodeIdPath.length === 0 ? editingCircuitName : rootCircuitName}
    </Button>
  );
};

interface CircuitNodeBreadcrumbItemProps {
  circuitNodeIdPath: string[];
}

const CircuitNodeBreadcrumbItem: React.FC<CircuitNodeBreadcrumbItemProps> = ({
  circuitNodeIdPath,
}) => {
  const dispatch = useDispatch();
  const circuitNodeId = last(circuitNodeIdPath)!;

  const nodeType = useSelector((state) =>
    nodeTypeFromNodeIdSelector(state, circuitNodeId)
  );
  const nodeName = useSelector((state) =>
    nodeNameOrDefaultFromNodeIdSelector(state, circuitNodeId)
  );

  const circuitId = nodeType ? nodeTypeToCircuitId(nodeType) : null;
  const circuitName = useSelector((state) =>
    circuitId ? circuitNameFromIdSelector(state, circuitId) : null
  );

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!circuitId) {
        return;
      }
      dispatch(viewCircuit(circuitId, circuitNodeIdPath));
    },
    [circuitId, circuitNodeIdPath, dispatch]
  );

  return (
    <Button onClick={onClick}>
      {nodeName} [{circuitName}]
    </Button>
  );
};
