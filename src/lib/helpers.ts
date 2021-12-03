export function toInt(str: string, radix: number = 10): number {
  return Number.parseInt(str, radix);
}

export function toString(num: number): string {
  return num.toString();
}

export function range(size: number): number[] {
  return [...Array(size).keys()];
}