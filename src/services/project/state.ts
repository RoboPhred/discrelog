export interface ProjectServiceState {
  projectName: string;
  projectModified: boolean;
}

const _defaultProps: ProjectServiceState = {
  projectName: "New Project",
  projectModified: false,
};

export const defaultProjectServiceState = Object.freeze(_defaultProps);
