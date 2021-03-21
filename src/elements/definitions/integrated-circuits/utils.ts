export function circuitIdToElementType(circuitId: string) {
  return `ic-${circuitId}`;
}

export function elementTypeToCircuitId(
  elementType: string | null
): string | null {
  if (!elementType || !elementType.startsWith("ic-")) {
    return null;
  }
  return elementType.substr(3);
}

export function getICBorderPath(inputPinCount: number, outputPinCount: number) {
  const height = Math.max(inputPinCount, outputPinCount, 1) * 50 - 20;
  return `M10,10 h80 v${height} h-80 z`;
}
