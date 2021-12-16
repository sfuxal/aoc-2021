import { toInt } from "../../lib/helpers";

type MappingEntry = {
  boardI: number,
  rowI: number,
  columnI: number,
}

type Marker = 'X' | string;

type DrawingEntry = {
  rows: Marker[][],
  columns: Marker[][],
}

type Mapping = Record<string, MappingEntry[]>
type Drawing = DrawingEntry[]

function formatInput(_input: string[]) {
  const [rawDrawInput, _, ...rawBoardsInput] = _input;
  const drawInput = rawDrawInput.split(',');

  let boardIndex = 0;
  const boards: string[][][] = [];
  for (let index = 0; index < rawBoardsInput.length; index++) {
    if (rawBoardsInput[index].length) {
      boards[boardIndex] = [
        ...(boards[boardIndex] || []),
        rawBoardsInput[index].split(' ').filter((val) => !!val)
      ]
    } else {
      boardIndex++;
    }
  }
  return { drawInput, boards };
}

function makeMappingAndDrawBlueprint(boards: string[][][]) {
  const mapping: Mapping = {};
  const drawing:Drawing = [];

  for (let boardI = 0; boardI < boards.length; boardI++) {
    for (let rowI = 0; rowI < boards[boardI].length; rowI++) {
      for (let columnI = 0; columnI < boards[boardI][rowI].length; columnI++) {
        const val = boards[boardI][rowI][columnI];
        mapping[val] = [
          ...(mapping[val]) || [],
          { boardI, rowI, columnI }
        ]

        if(!drawing[boardI]) drawing[boardI] = { rows: [], columns: []};

        if(!drawing[boardI].rows[rowI]) drawing[boardI].rows.push([val]);
        else drawing[boardI].rows[rowI][columnI] = val;

        if(!drawing[boardI].columns[columnI]) drawing[boardI].columns.push([val])
        else drawing[boardI].columns[columnI][rowI] = val;
      }
    }
  }
  return {mapping, drawing};
}

function draw(
  boardsDrawing: Drawing, occurrences: MappingEntry[]
): Drawing {
  const drawing = boardsDrawing;
  occurrences.forEach(({ boardI, rowI, columnI }: MappingEntry) => {
    drawing[boardI].rows[rowI][columnI] = 'X';
    drawing[boardI].columns[columnI][rowI] = 'X';
  })
  return drawing;
}

function checkWinner(boardsDrawing: Drawing): number | undefined {
  let winnerIndex;
  for (let boardI = 0; boardI < boardsDrawing.length; boardI++) {
    const board = boardsDrawing[boardI];
    if (
      board.rows.some((row) => row.every((item) => item === 'X'))
      || board.columns.some((column) => column.every((item) => item === 'X'))
    ) {
      winnerIndex = boardI;
      break;
    }
  }
  return winnerIndex || undefined
}

function sumUnmarked(boardDrawing:DrawingEntry):number {
  const {rows} = boardDrawing;
  const sum = rows.reduce<number>((acc:number, row:string[]) => {
    return acc + row.reduce((acc, val) => {
      if(val === 'X') return acc;
      return acc + toInt(val)
    }, 0)
  }, 0)
  return sum;
}

export function one(_input: string[]): number {
  const { drawInput, boards } = formatInput(_input);
  const {mapping, drawing: drawBlueprint} = makeMappingAndDrawBlueprint(boards);

  let boardsDrawing: Drawing = drawBlueprint;
  let winningBoardIndex: number | undefined;
  let value: string = '';

  for (let drawI = 0; drawI < drawInput.length; drawI++) {
    value = drawInput[drawI];
    const occurrences = mapping[value];

    boardsDrawing = draw(boardsDrawing, occurrences);

    if (drawI >= (boards[0][0].length - 1)) {
      winningBoardIndex = checkWinner(boardsDrawing);
      if (winningBoardIndex) break;
    }
  }

  if(!winningBoardIndex) throw Error('No board won');
  const sum = sumUnmarked(boardsDrawing[winningBoardIndex]);
  return sum * toInt(value);
}

export function two(_input: string[]): number {
  return 0;
}
