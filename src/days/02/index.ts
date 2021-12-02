import { toInt } from "../../lib/helpers";

type Sums = {
  forward: number,
  up: number,
  down: number,
}

function getValue(command: string): number {
  return toInt(command.split(' ')[1])
}

export function one(_input: string[]): number {
  const sums: Sums = _input.reduce<Sums>((acc: Sums, command: string) => {
    const value = getValue(command);

    switch (command.split(' ')[0]) {
      case 'forward':
        return {
          ...acc,
          forward: acc.forward + value,
        }
      case 'up':
        return {
          ...acc,
          up: acc.up + value,
        }
      case 'down':
        return {
          ...acc,
          down: acc.down + value,
        }
      default:
        return acc;
    }
  }, { forward: 0, up: 0, down: 0 })
  const { forward, up, down } = sums;
  return forward * (down - up);
}

type Coordinates = {
  horizontalPos: number,
  aim: number,
  depth: number
}

export function two(_input: string[]): number {
  const coordinates: Coordinates = _input
    .reduce<Coordinates>((acc: Coordinates, command: string) => {
      const value = getValue(command);

      switch (command.split(' ')[0]) {
        case 'forward':
          return {
            ...acc,
            horizontalPos: acc.horizontalPos + value,
            depth: acc.depth + (acc.aim * value),
          }
        case 'up':
          return {
            ...acc,
            aim: acc.aim - value,
          }
        case 'down':
          return {
            ...acc,
            aim: acc.aim + value,
          }
        default:
          return acc;
      }
    }, { horizontalPos: 0, aim: 0, depth: 0 })
    
  return coordinates.horizontalPos * coordinates.depth;
}
