export function toInt(str: string): number {
  return Number.parseInt(str, 10);
}

export function toString(num: number): string {
  return num.toString();
}

export function range(size: number): number[] {
  return [...Array(size).keys()];
}