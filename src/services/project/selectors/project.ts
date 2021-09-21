import { createProjectSelector } from "../utils";

export const projectNameSelector = createProjectSelector(
  (state) => state.projectName
);

export const projectModifiedSelector = createProjectSelector(
  (state) => state.projectModified
);

export const projectLoadStateSelector = createProjectSelector(
  (state) => state.projectLoadState
);
