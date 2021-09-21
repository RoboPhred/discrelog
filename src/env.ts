export const isDev = process.env.NODE_ENV === "development";

const rootUrlBuilder = new URL(window.location.origin);
rootUrlBuilder.pathname = __webpack_public_path__;
export const rootUrl = rootUrlBuilder.toString();

export const appVersion = DISCRELOG_VERSION;
