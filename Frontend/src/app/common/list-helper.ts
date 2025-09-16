export function getIndicesList(count: number): number[] {
  const indices = [];
  for (let i = 0; i < count; i++) {
    indices.push(i);
  }
  return indices;
}

export function maxInList(list: number[]): number {
  return list.reduce((prev, curr) => curr > prev ? curr : prev, 0);
}
