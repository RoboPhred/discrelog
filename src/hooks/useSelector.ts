import { useSelector as useSelectorRedux } from "react-redux";

import { AppState } from "@/store";

export default function useSelector<T>(selector: (s: AppState) => T) {
  return useSelectorRedux<AppState, T>(selector);
}
