import cloneDeep from "lodash/cloneDeep";
import { toInt } from "../../lib/helpers";

// Implementation of A* search algorithm 
// [nice Introduction to A* search algorithm](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

type RiskLevelMap = number[][];
type Coordinate = {
  row: number,
  col: number,
}
type FrontierItem = {
  coordinate: Coordinate,
  priority: number,
}

function formatInput(input: string[]): RiskLevelMap {
  return input.map((line) => line.split('').map((i) => toInt(i)))
}

function getTargetCoordinate(map: RiskLevelMap): Coordinate {
  return {
    row: map.length - 1,
    col: map[0].length - 1
  }
}

function toLocationId(coordinate: Coordinate): string {
  return `${coordinate.row},${coordinate.col}`;
}

function checkReachedTarget(currentCoordinate: Coordinate, targetCoordinate: Coordinate): boolean {
  return currentCoordinate.row === targetCoordinate.row
    && currentCoordinate.col === targetCoordinate.col;
}

// TODO could be extracted in helper to DRY day 11
function getNeighbors(curCoordinate: Coordinate, map: RiskLevelMap) {
  const neighbors = ['row', 'col']
    .map((direction) => [-1, 1]
      .map((val) => {
        const neighbor: Coordinate = {
          row: direction === 'row' ? curCoordinate.row + val : curCoordinate.row,
          col: direction === 'col' ? curCoordinate.col + val : curCoordinate.col
        }
        return (
          map[neighbor.row] != null
          && map[neighbor.row][neighbor.col] != null
        )
          ? neighbor
          : null
      })
      .filter((c) => c != null)
    ).flat()
  return neighbors as Coordinate[];
}

function findInsertIndexByPriority(frontier: FrontierItem[], itemToInsert: FrontierItem): number {
  let index = 0;
  let stop = false;
  while (!stop && frontier[index]) {
    if (frontier[index].priority < itemToInsert.priority) {
      stop = true;
    } else {
      index++
    }
  }
  return index;
}

function heuristic(targetCoordinate: Coordinate, nextCoordinate: Coordinate): number {
  return Math.abs(targetCoordinate.row - nextCoordinate.row) + Math.abs(targetCoordinate.col - nextCoordinate.col)
}

function findLowestTotalRiskLevel(riskLevelMap: RiskLevelMap): number {
  const targetCoordinate = getTargetCoordinate(riskLevelMap);

  /**
   * Array of locations to visit in priority order.
   * ! Last item has highest priority.
   */
  const frontier: FrontierItem[] = [];
  const cameFrom: Record<string, Coordinate | 'none'> = {};
  const costSoFar: Record<string, number> = {};
  const startCoordinate = { row: 0, col: 0 };
  const startLocationId = toLocationId(startCoordinate);

  frontier.push({
    coordinate: startCoordinate,
    priority: 0
  });
  cameFrom[startLocationId] = 'none';
  costSoFar[startLocationId] = 0;

  while (frontier.length > 0) {
    const current = frontier.pop();

    // early returns
    if (!current) break;
    if (checkReachedTarget(current.coordinate, targetCoordinate)) break;

    const neighbors = getNeighbors(current.coordinate, riskLevelMap);

    neighbors.forEach((nextCoordinate) => {
      const nextLocationId = toLocationId(nextCoordinate)
      const newCost = costSoFar[toLocationId(current.coordinate)] + riskLevelMap[nextCoordinate.row][nextCoordinate.col];
      if (costSoFar[nextLocationId] == null || newCost < costSoFar[nextLocationId]) {
        costSoFar[nextLocationId] = newCost;
        const priority = newCost + heuristic(targetCoordinate, nextCoordinate);

        const newFrontierItem = { coordinate: nextCoordinate, priority };
        const insertIndex = findInsertIndexByPriority(frontier, newFrontierItem);
        frontier.splice(insertIndex, 0, newFrontierItem);

        cameFrom[nextLocationId] = current.coordinate;
      }
    })
  }

  return costSoFar[toLocationId(targetCoordinate)] || 0;
}

function maybeWrap(newLevel: number): number {
  return newLevel > 9 ? newLevel - 9 : newLevel
}

function expandMap(initialMap: RiskLevelMap, count: number): RiskLevelMap {
  const initialRowCount = initialMap.length;
  const expandedMap: RiskLevelMap = cloneDeep(initialMap);

  expandedMap.forEach((row, rowIndex) => {
    for (let step = 1; step < count; step++) {
      if (initialMap[rowIndex]) {

        initialMap[rowIndex].forEach((level) => {
          const newLevel = maybeWrap(level + step);
          row.push(newLevel);
        })
      }
    }
  })

  for (let rowIndex = initialRowCount; rowIndex < (count * initialRowCount); rowIndex++) {
    const step = Math.floor(rowIndex / initialRowCount);

    for (let colIndex = 0; colIndex < expandedMap[0].length; colIndex++) {
      const initialRowIndex = rowIndex - step * initialRowCount;
      const newLevel = maybeWrap(expandedMap[initialRowIndex][colIndex] + step);
      if (!expandedMap[rowIndex]) expandedMap.push([newLevel])
      else expandedMap[rowIndex].push(newLevel);
    }
  }

  return expandedMap;
}

export function one(_input: string[]): number {
  const riskLevelMap = formatInput(_input);
  return findLowestTotalRiskLevel(riskLevelMap);
}

export function two(_input: string[]): number {
  const riskLevelMap = expandMap(formatInput(_input), 5);
  return findLowestTotalRiskLevel(riskLevelMap);
}
