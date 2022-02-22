import { toInt } from "../../lib/helpers";

type Coordinate = {
  rowIndex: number,
  colIndex: number,
}

function formatInput(input: string[]): number[][] {
  return input.map((line) => line.split('').map((level) => toInt(level)));
}

function getAdjacentCoordinates(grid: number[][], rowIndex: number, colIndex: number) {
  const adjacentCoordinates = [-1, 0, 1]
    .map((rowPos) => [-1, 0, 1]
      .map((colPos) => {
        const neighbor = { rowIndex: rowIndex + rowPos, colIndex: colIndex + colPos };
        return (
          grid[neighbor.rowIndex] != null
          && grid[neighbor.rowIndex][neighbor.colIndex] != null
          // exclude current coordinate
          && !(neighbor.rowIndex === rowIndex && neighbor.colIndex === colIndex)
        )
          ? neighbor
          : null
      })
      .filter((c) => c != null)
    )
    .flat()

  return adjacentCoordinates as Coordinate[];
}

function increaseLevels(_grid: number[][]) {
  let grid = [..._grid];
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
      grid[rowIndex][colIndex]++;
      if (grid[rowIndex][colIndex] === 10) {
        grid = increaseNeighbors(grid, rowIndex, colIndex);
      }
    }
  }
  return grid;
}

function increaseNeighbors(_grid: number[][], rowIndex: number, colIndex: number) {
  let grid = [..._grid]
  const adjacentCoordinates = getAdjacentCoordinates(grid, rowIndex, colIndex);
  adjacentCoordinates.forEach((adjacentCoordinate) => {
    grid[adjacentCoordinate.rowIndex][adjacentCoordinate.colIndex]++;
    if (grid[adjacentCoordinate.rowIndex][adjacentCoordinate.colIndex] === 10) {
      grid = increaseNeighbors(grid, adjacentCoordinate.rowIndex, adjacentCoordinate.colIndex);
    }
  })
  return grid;
}

function resetFlashed(grid: number[][]) {
  let flashes = 0;
  const updatedGrid = grid.map((row) => row.map((level) => {
    if (level > 9) {
      flashes++;
      return 0;
    }
    return level;
  }))
  return { updatedGrid, flashes }
}

export function one(_input: string[]): number {
  let grid = formatInput(_input);
  let flashCount = 0;
  let stepCount = 1;

  while (stepCount <= 100) {
    grid = increaseLevels(grid);
    const { flashes, updatedGrid } = resetFlashed(grid);
    grid = updatedGrid;
    flashCount = flashCount + flashes;

    stepCount++;
  }

  return flashCount;
}

export function two(_input: string[]): number {
  let grid = formatInput(_input);
  let stepCount = 1;
  let allFlashingStep;

  while (allFlashingStep == null && stepCount < 1000) {
    grid = increaseLevels(grid);
    grid = resetFlashed(grid).updatedGrid;
    if (grid.every((row) => row.every((level) => level === 0))) allFlashingStep = stepCount;

    stepCount++;
  }

  return allFlashingStep ?? 0;
}
