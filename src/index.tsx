import * as React from "react";
import * as ReactDOM from "react-dom";
import "resize-observer-polyfill";

import { Provider } from "react-redux";

import "./styles";

import { store } from "./store";

import App from "./components/App";

const rootEl = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootEl
);
