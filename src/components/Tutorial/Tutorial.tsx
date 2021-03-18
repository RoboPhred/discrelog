import * as React from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";

import { asArray } from "@/arrays";

import useSelector from "@/hooks/useSelector";

import {
  isTutorialActiveSelector,
  tutorialAnnotationsSelector,
} from "@/services/tutorial/selectors/tutorial";

import Button from "../Button";
import Tooltip from "../Tooltip";

import styles from "./Tutorial.module.css";
import { AnnotatedElement } from "@/services/tutorial/state";

const Tutorial: React.FC = () => {
  const isTutorialActive = useSelector(isTutorialActiveSelector);
  const tutorialAnnotations = useSelector(tutorialAnnotationsSelector);

  if (!isTutorialActive) {
    return null;
  }

  const annotations = tutorialAnnotations.map((annotation) => (
    <Annotation key={annotation.selector} {...annotation} />
  ));

  const css = tutorialAnnotations
    .map(
      ({ selector }) => `
    ${selector} {
      position: relative;
      z-index: 10;
    }
  `
    )
    .join("\n");

  return createPortal(
    <div className={styles["tutorial"]}>
      <div className={styles["tutorial-backdrop"]} />
      <style>{css}</style>
      {annotations}
    </div>,
    document.body
  );
};

export default Tutorial;

const Annotation: React.FC<AnnotatedElement> = ({
  selector,
  message,
  placement,
  action = [],
}) => {
  const dispatch = useDispatch();

  const element = document.querySelector(selector);

  React.useEffect(() => {
    if (element) {
      element.scrollIntoView();
    }
  }, [element]);

  const actions = asArray(action);

  if (!element || (!message && !actions.length)) {
    return null;
  }

  const actionElements = actions.map(({ name, action }) => {
    return (
      <Button key={name} size="small" onClick={() => dispatch(action)}>
        {name}
      </Button>
    );
  });

  return (
    <Tooltip
      className={styles["tutorial-tooltip"]}
      anchorEl={element}
      placement={placement}
      isOpen={true}
    >
      {message}
      {actionElements && (
        <div className={styles["tutorial-tooltip-actions"]}>
          {actionElements}
        </div>
      )}
    </Tooltip>
  );
};
