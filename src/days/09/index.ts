import { toInt } from "../../lib/helpers";

type Coordinate = { rowIndex: number, colIndex: number }

function getValueIfExists(nestedArray: number[][], rowIndex: number, colIndex: number) {
  return nestedArray[rowIndex] ? nestedArray[rowIndex][colIndex] : undefined
}

function findLowPointCoordinates(heightMap: number[][]): Coordinate[] {
  const lowPointCoordinates: Coordinate[] = [];
  for (let rowIndex = 0; rowIndex < heightMap.length; rowIndex++) {
    for (let colIndex = 0; colIndex < heightMap[0].length; colIndex++) {
      const adjacentValues: Array<number | undefined> = [
        getValueIfExists(heightMap, rowIndex, colIndex - 1), // left
        getValueIfExists(heightMap, rowIndex, colIndex + 1), // right
        getValueIfExists(heightMap, rowIndex - 1, colIndex), // up
        getValueIfExists(heightMap, rowIndex + 1, colIndex), // down
      ];
      const isLowPoint = adjacentValues.every((value) => value == null || value > heightMap[rowIndex][colIndex])
      if (isLowPoint) lowPointCoordinates.push({ rowIndex, colIndex })
    }
  }
  return lowPointCoordinates;
}

export function one(_input: string[]): number {
  const heightMap = _input.map((line) => (
    line.split('').map((height) => toInt(height)))
  );

  const lowPointCoordinates = findLowPointCoordinates(heightMap);

  return lowPointCoordinates.reduce((acc, coordinate) => {
    const { rowIndex, colIndex } = coordinate;
    const height = heightMap[rowIndex][colIndex];
    return acc + height + 1
  }, 0);
}

export function two(_input: string[]): number {
  return 0;
}
