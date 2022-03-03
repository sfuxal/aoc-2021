import { toInt } from "../../lib/helpers";

type Direction = 'x' | 'y'; // vertical | horizontal

type Fold = {
  direction: Direction,
  line: number
}

type Dot = {
  x: number, // col
  y: number, // row
}

type Map = number[][];

function formatInput(input: string[]): { folds: Fold[], dots: Dot[] } {
  const folds: Fold[] = [];
  const dots: Dot[] = [];

  input.forEach((l) => {
    if (l.startsWith('fold')) {
      const [direction, line] = l.split('fold along ')[1].split('=');
      folds.push({ direction: direction as Direction, line: toInt(line) });
      return;
    }
    if (l.length) {
      const [x, y] = l.split(',');
      dots.push({ x: toInt(x), y: toInt(y) })
    }
  })

  return { folds, dots };
}

function constructMap(dots: Dot[]): Map {
  const map: Map = [];

  dots.forEach(({ x, y }) => {
    if (!map[y]) map[y] = [];
    map[y][x] = 1
  })

  return map;
}

function mergeLines(curLine: number[], lineToMerge: number[]): number[] {
  /**
   * map is only filled to the point where there are dots
   * so the lines potentially don't have the same length.
   * We need to use the longer one as base in order to merge correctly.
   */
  const baseArray = curLine.length > lineToMerge.length ? curLine : lineToMerge;

  const mergedLine = [];
  for (let index = 0; index < baseArray.length; index++) {
    if (curLine[index] === 1 || lineToMerge[index] === 1) mergedLine.push(1);
    else mergedLine.push(0)
  }
  return mergedLine;
}

function fold(foldInstruction: Fold, _map: Map): Map {
  const map = [];
  const { line: foldLine } = foldInstruction;
  let distanceFromFoldLine = 1;

  while (foldLine - distanceFromFoldLine >= 0) {
    if (foldInstruction.direction === 'y') {
      // fold horizontally
      const curLine = _map[foldLine - distanceFromFoldLine] || [];
      const lineToMerge = _map[foldLine + distanceFromFoldLine] || [];
      map[foldLine - distanceFromFoldLine] = mergeLines(curLine, lineToMerge);
    } else {
      // fold vertically
      for (let index = 0; index < _map.length; index++) {
        if (!map[index]) map.push([]);
        const hasDot = (_map[index] || [])[foldLine - distanceFromFoldLine] === 1
          || (_map[index] || [])[foldLine + distanceFromFoldLine] === 1;
        map[index][foldLine - distanceFromFoldLine] = hasDot ? 1 : 0;
      }
    }

    distanceFromFoldLine++;
  }

  return map;
}

function sumDots(map: Map): number {
  return map.reduce((sum, line) => {
    return sum + (line || []).reduce((lineSum, item) => {
      return lineSum + (item ?? 0)
    }, 0)
  }, 0);
}

export function one(_input: string[]): number {
  const { folds, dots } = formatInput(_input);
  const map = constructMap(dots);
  const newMap = fold(folds[0], map);
  return sumDots(newMap);
}

export function two(_input: string[]): number {
  const { folds, dots } = formatInput(_input);
  let map = constructMap(dots);
  folds.forEach((foldInstruction) => {
    map = fold(foldInstruction, map);
  })
  /**
   * see https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-65.php
   * for instructions how to log colors
   */
  map.forEach((line) =>
    console.log(line
      .map((i) => {
        if (i === 1) return `\x1b[41m1\x1b[0m`;
        return i
      })
      .join(' '))
  )
  return sumDots(map);
}