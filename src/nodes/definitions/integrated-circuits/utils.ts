export function circuitIdToNodeType(circuitId: string) {
  return `ic-${circuitId}`;
}

export function nodeTypeToCircuitId(nodeType: string | null): string | null {
  if (!nodeType || !nodeType.startsWith("ic-")) {
    return null;
  }
  return nodeType.substr(3);
}

export function getICBorderPath(inputPinCount: number, outputPinCount: number) {
  const height = Math.max(inputPinCount, outputPinCount, 1) * 50 - 20;
  return `M10,10 h80 v${height} h-80 z`;
}
