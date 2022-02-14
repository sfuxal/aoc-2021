import { toInt } from "../../lib/helpers";

type Coordinate = { rowIndex: number, colIndex: number }

function getHeightMap(input: string[]): number[][] {
  return input.map((line) => (
    line.split('').map((height) => toInt(height)))
  );
}

function getValueIfExists(nestedArray: number[][], rowIndex: number, colIndex: number) {
  return nestedArray[rowIndex] ? nestedArray[rowIndex][colIndex] : undefined
}

function getCoordinateString(rowIndex: number, colIndex: number) {
  return `row:${rowIndex}-col:${colIndex}`
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

function getHeightsAndCoordinates(heightMap: number[][], rowIndex: number, colIndex: number) {
  const curCoordinate: string = getCoordinateString(rowIndex, colIndex);
  const nextHeight: number | undefined = getValueIfExists(heightMap, rowIndex, colIndex + 1);
  const nextCoordinate: string | undefined = nextHeight != null ? getCoordinateString(rowIndex, colIndex + 1) : undefined;
  const downHeight: number | undefined = getValueIfExists(heightMap, rowIndex + 1, colIndex);
  const downCoordinate: string | undefined = downHeight != null ? getCoordinateString(rowIndex + 1, colIndex) : undefined;
  return {
    curCoordinate, nextHeight, nextCoordinate, downHeight, downCoordinate
  }
}

function findBasinIndexes(basins: string[][], curCoordinate: string, nextCoordinate: string | undefined) {
  let curHeightBasinIndex = basins.findIndex((basin) => basin.includes(curCoordinate));
  let nextHeightBasinIndex = -1;
  if (nextCoordinate) {
    nextHeightBasinIndex = curHeightBasinIndex !== -1 && basins[curHeightBasinIndex].includes(nextCoordinate)
      ? curHeightBasinIndex
      : basins.findIndex((basin) => basin.includes(nextCoordinate))
  }
  return { curHeightBasinIndex, nextHeightBasinIndex }
}

export function one(_input: string[]): number {
  const heightMap = getHeightMap(_input);

  const lowPointCoordinates = findLowPointCoordinates(heightMap);

  return lowPointCoordinates.reduce((acc, coordinate) => {
    const { rowIndex, colIndex } = coordinate;
    const height = heightMap[rowIndex][colIndex];
    return acc + height + 1
  }, 0);
}

export function two(_input: string[]): number {
  const heightMap = getHeightMap(_input);

  const basins: string[][] = [];

  for (let rowIndex = 0; rowIndex < heightMap.length; rowIndex++) {
    for (let colIndex = 0; colIndex < heightMap[0].length; colIndex++) {
      const curHeight = heightMap[rowIndex][colIndex];

      if (curHeight !== 9) {
        const {
          curCoordinate, nextHeight, nextCoordinate, downHeight, downCoordinate
        } = getHeightsAndCoordinates(heightMap, rowIndex, colIndex);

        let { curHeightBasinIndex, nextHeightBasinIndex } = findBasinIndexes(basins, curCoordinate, nextCoordinate);

        // current and next height aren't in a basin yet
        // -> start fresh basin
        if (curHeightBasinIndex === -1 && nextHeightBasinIndex === -1) {
          basins.push([curCoordinate]);
        }
        // current height is not in a basin yet but next one already is
        // -> put current height in same basin as next height
        if (curHeightBasinIndex === -1 && nextHeightBasinIndex !== -1) {
          curHeightBasinIndex = nextHeightBasinIndex;
          basins[curHeightBasinIndex].push(curCoordinate)
        }
        // current and next heights are in two different basins
        // -> merge those basins basins
        if (curHeightBasinIndex !== -1 && nextHeightBasinIndex !== -1 && curHeightBasinIndex !== nextHeightBasinIndex) {
          basins[curHeightBasinIndex] = [...basins[curHeightBasinIndex], ...basins[nextHeightBasinIndex]];
          basins.splice(nextHeightBasinIndex, 1);
          if (nextHeightBasinIndex < curHeightBasinIndex) curHeightBasinIndex--;
          nextHeightBasinIndex = curHeightBasinIndex;
        }

        // check and potentially add right / down neighbors
        const curBasin = basins[(curHeightBasinIndex === -1 ? basins.length - 1 : curHeightBasinIndex)];
        if (nextCoordinate && nextHeight !== 9 && nextHeightBasinIndex === -1) curBasin.push(nextCoordinate);
        if (downCoordinate && downHeight !== 9) curBasin.push(downCoordinate);
      }
    }
  }

  basins.sort((a, b) => b.length - a.length);
  return basins.slice(0, 3).reduce((acc, basin) => {
    return acc * basin.length
  }, 1)
}
