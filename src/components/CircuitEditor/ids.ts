export function getCircuitEditorHtmlId(editorId: string) {
  return `circuit-editor-${editorId}`;
}

export function getElementHtmlId(editorId: string, elementId: string) {
  return `editor-${editorId}--element-${elementId}`;
}

export function getElementPinHtmlId(
  editorId: string,
  elementId: string,
  pinId: string
): string {
  return `editor-${editorId}--element-${elementId}--pin-${pinId}`;
}

export function getWireHtmlId(editorId: string, wireId: string) {
  return `editor-${editorId}--wire-${wireId}`;
}

export function getWireJointHtmlId(editorId: string, jointId: string) {
  return `editor-${editorId}--wire-joint-${jointId}`;
}
