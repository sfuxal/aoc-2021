import { toInt } from "../../lib/helpers";

export function one(_input: string[]): number {
  const outputValues = _input
    .map((val) => val.split(' | ')[1].split(' '))
    .flat()
  const uniqueNumberOutputs = outputValues
    .filter((val) => [2, 4, 3, 7].includes(val.length));
  return uniqueNumberOutputs.length;
}

export function two(_input: string[]): number {
  return 0;
}
