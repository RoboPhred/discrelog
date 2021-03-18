import { AnyAction } from "redux";
import { Options } from "@popperjs/core";

import { MaybeArray } from "@/arrays";
import { AppState } from "@/store";

export interface TutorialAction {
  name: string;
  action: AnyAction;
}

export interface AnnotatedElement {
  selector: string;
  message?: string;
  placement?: Options["placement"];
  action?: MaybeArray<TutorialAction>;
}

export interface TutorialServiceState {
  activeTutorial: string | null;
  annotatedElements: AnnotatedElement[];
  preTutorialState: AppState | null;
}

const _defaultState: TutorialServiceState = {
  activeTutorial: null,
  annotatedElements: [],
  preTutorialState: null,
};

export const defaultTutorialServiceState = Object.freeze(_defaultState);
