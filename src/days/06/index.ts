import { toInt } from "../../lib/helpers";

export function one(_input: string[]): number {
  let timers = _input[0].split(',').map((timer) => toInt(timer));
  let day = 1;

  while (day <= 80) {
    let newFishCount = 0;

    for (let index = 0; index < timers.length; index++) {
      const timer = timers[index];
      if (timer === 0) {
        newFishCount++;
        timers[index] = 6;
      } else {
        timers[index] = timer - 1;
      }
    }

    timers = [
      ...timers,
      ...Array(newFishCount).fill(8)
    ]

    day++;
    newFishCount = 0;
  }

  return timers.length;
}

export function two(_input: string[]): number {
  return 0;
}
