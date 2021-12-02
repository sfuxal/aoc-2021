import { toInt, toString } from "../../lib/helpers";

// export function one(_input: string[]): number {
//   const input = _input.map(toInt);
//   let count = 0;
//   for (let index = 0; index < input.length; index++) {
//     const prev = input[index - 1];
//     if(prev && input[index] > prev) count++;
//   }
//   return count;
// }

type Acc = {
  prev?: number,
  count: number,
}

export function one(_input: string[]): number {
  const finalAcc: Acc = _input.reduce<Acc>((acc: Acc, val: string): Acc => {
    const current = toInt(val);
    return {
      prev: current,
      count: acc.prev && current > acc.prev ? acc.count + 1 : acc.count,
    }
  }, { prev: undefined, count: 0 });
  return finalAcc.count;
}

export function two(_input: string[]): number {
  const threeMeasures = _input.reduce<string[]>((acc:string[], val:string, index: number) => {
    const prev = toInt(_input[index - 1]);
    const next = toInt(_input[index + 1]);
    if(prev && next) acc.push(toString(prev + toInt(_input[index]) + next));
    return acc;
  }, []);

  return one(threeMeasures);
}
