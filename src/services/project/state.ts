export interface ProjectServiceState {
  projectLoadState: "no-project" | "loading" | "loaded";
  projectName: string;
  projectModified: boolean;
}

const _defaultProps: ProjectServiceState = {
  projectLoadState: "no-project",
  projectName: "New Project",
  projectModified: false,
};

export const defaultProjectServiceState = Object.freeze(_defaultProps);
