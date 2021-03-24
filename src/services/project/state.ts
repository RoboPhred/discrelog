export interface ProjectServiceState {
  projectName: string;
  projectModified: boolean;
  isLoading: boolean;
}

const _defaultProps: ProjectServiceState = {
  projectName: "New Project",
  projectModified: false,
  isLoading: false,
};

export const defaultProjectServiceState = Object.freeze(_defaultProps);
