import { toInt } from "../../lib/helpers";

function transformInput(input: string[]) {
  return input[0].split(',').map((timer) => toInt(timer))
}

export function one(_input: string[]): number {
  let timers = transformInput(_input);
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
  let initialTimers = transformInput(_input);

  /**
   * Array of fish counts per timer (0...8)
   */
  const timerCounts: number[] = Array(9).fill(0);
  initialTimers.forEach((timer) => { timerCounts[timer]++ });

  let day = 1;

  while (day <= 256) {
    const zeroTimerCount = timerCounts[0];

    for (let timer = 0; timer < timerCounts.length - 1; timer++) {
      // move fish count per timer to next lower timer
      timerCounts[timer] = timerCounts[timer + 1] ?? 0;
    }

    timerCounts[6] = timerCounts[6] + zeroTimerCount;
    timerCounts[8] = zeroTimerCount;

    day++;
  }

  return timerCounts.reduce((totalCount, timerCount) => {
    totalCount = totalCount + timerCount;
    return totalCount
  }, 0);
}
