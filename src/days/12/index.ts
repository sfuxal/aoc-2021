import cloneDeep from 'lodash/cloneDeep';

type ConnectionMap = Record<string, string[]>;
type Option = {
  path: string[],
  options: Option[],
}

function getIsSmall(caveId: string): boolean {
  return caveId === caveId.toLowerCase();
}

function getConnectionMap(input: string[]): ConnectionMap {
  return input.reduce<ConnectionMap>((map, line) => {
    const [start, end] = line.split('-');
    map[start] = map[start] ? [...map[start], end] : [end];
    map[end] = map[end] ? [...map[end], start] : [start];
    return map
  }, {})
}

/**
 * Caves that have only a single connection to a small cave are irrelevant for part one.
 * Those caves can be removed from the map.
 */
function removeIrrelevantCaves(_map: ConnectionMap): ConnectionMap {
  const map = cloneDeep(_map);
  const irrelevantCaves: string[] = [];
  const caves = Object.keys(map);

  caves.forEach((cave) => {
    if (map[cave].length === 1 && getIsSmall(map[cave][0])) {
      irrelevantCaves.push(cave);
    }
  })

  irrelevantCaves.forEach((cave) => {
    const singleConnection = map[map[cave][0]];
    const index = singleConnection.indexOf(cave);
    singleConnection.splice(index, 1);
    delete map[cave];
  })
  return map;
}

function partOneFilter(connectedCave: string, path: string[]): boolean {
  return connectedCave !== 'start'
    && (!getIsSmall(connectedCave) || !path.includes(connectedCave))
}

function getPathIncludesSmallDoubleVisit(path: string[]): boolean {
  const occurrences: Record<string, number> = {};
  for (let i = 0; i < path.length; i++) {
    if (!getIsSmall(path[i])) continue;
    if (occurrences[path[i]]) return true;
    occurrences[path[i]] = 1;
  }
  return false;
}

function partTwoFilter(connectedCave: string, path: string[]) {
  return connectedCave !== 'start'
    && (
      !getIsSmall(connectedCave)
      || !path.includes(connectedCave)
      || !getPathIncludesSmallDoubleVisit(path)
    )
}

function constructTree(
  curCave: string,
  parentPath: string[],
  connectionMap: ConnectionMap,
  paths: string[][],
  filterFunction: (cave: string, path: string[]) => boolean
) {
  const path = [...parentPath, curCave];
  const options: Option[] = curCave === 'end'
    ? []
    : connectionMap[curCave]
      .filter((connectedCave) => filterFunction(connectedCave, path))
      .map((cave) => constructTree(cave, path, connectionMap, paths, filterFunction))

  if (curCave === 'end') paths.push(path);

  return {
    path,
    options,
  }
}

export function one(_input: string[]): number {
  let connectionMap: ConnectionMap = getConnectionMap(_input);
  connectionMap = removeIrrelevantCaves(connectionMap);

  const paths: string[][] = [];
  constructTree('start', [], connectionMap, paths, partOneFilter);

  return paths.length;
}

export function two(_input: string[]): number {
  const connectionMap: ConnectionMap = getConnectionMap(_input);

  const paths: string[][] = [];
  constructTree('start', [], connectionMap, paths, partTwoFilter);

  return paths.length;
}
