import { createTutorialSelector } from "../utils";

export const isTutorialActiveSelector = createTutorialSelector(
  (s) => s.activeTutorial != null
);

export const tutorialAnnotationsSelector = createTutorialSelector(
  (s) => s.annotatedElements
);
