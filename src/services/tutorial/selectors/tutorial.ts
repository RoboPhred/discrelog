import { createTutorialSelector } from "../utils";

export const isTutorialActiveSelector = createTutorialSelector(
  (s) => s.annotatedElements.length > 0
);

export const tutorialAnnotationsSelector = createTutorialSelector(
  (s) => s.annotatedElements
);
