import { toInt } from "../../lib/helpers";

type Coordinate = {
  x: number,
  y: number,
}

type Line = {
  start: Coordinate,
  end: Coordinate
}

function toCoordinate(input: string): Coordinate {
  const parts = input.split(',');
  return {
    x: toInt(parts[0]),
    y: toInt(parts[1])
  }
}

function formatInput(input: string[]): Line[] {
  return input
    .map((line) => {
      const lineParts = line.split(' -> ');
      const start = toCoordinate(lineParts[0]);
      const end = toCoordinate(lineParts[1]);
      return { start, end }
    })
}

function checkDirection(line: Line): 'horizontal' | 'vertical' | 'diagonal' | undefined {
  if (Math.abs(line.start.x - line.end.x) === Math.abs(line.start.y - line.end.y)) return 'diagonal';
  if (line.start.x === line.end.x) return 'vertical';
  if (line.start.y === line.end.y) return 'horizontal';
  return undefined;
}

function findStartEndIndex(start: number, end: number): number[] {
  return [start, end].sort((a, b) => a - b);
}

function drawHorizontal(drawing: number[][], row: number, colStart: number, colEnd: number): number[][] {
  for (let index = colStart; index <= colEnd; index++) {
    if (!drawing[row]) drawing[row] = [];
    if (drawing[row][index] == null) drawing[row][index] = 0;
    drawing[row][index]++;
  }
  return drawing;
}

function drawVertical(drawing: number[][], column: number, rowStart: number, rowEnd: number): number[][] {
  for (let index = rowStart; index <= rowEnd; index++) {
    if (!drawing[index]) drawing[index] = [];
    if (drawing[index][column] == null) drawing[index][column] = 0;
    drawing[index][column]++;
  }
  return drawing;
}

function drawDiagonal(
  drawing: number[][],
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number
): number[][] {
  let rowI = rowStart;
  let colI = colStart;

  while (rowStart < rowEnd ? rowI <= rowEnd : rowI >= rowEnd) {
    if (!drawing[rowI]) drawing[rowI] = [];
    if (drawing[rowI][colI] == null) drawing[rowI][colI] = 0;
    drawing[rowI][colI]++;

    if (rowStart < rowEnd) rowI++;
    else rowI--;
    if (colStart < colEnd) colI++;
    else colI--;
  }
  return drawing;
}

function draw(lines: Line[], considerDiagonal: boolean = false): number[][] {
  let drawing: number[][] = [];

  lines.forEach((line) => {
    const direction = checkDirection(line);
    if (!direction) return;

    switch (direction) {
      case 'horizontal':
        const [colStart, colEnd] = findStartEndIndex(line.start.x, line.end.x);
        const row = line.start.y;
        drawing = drawHorizontal(drawing, row, colStart, colEnd);
        break;
      case 'vertical':
        const [rowStart, rowEnd] = findStartEndIndex(line.start.y, line.end.y);
        const column = line.start.x;
        drawing = drawVertical(drawing, column, rowStart, rowEnd);
        break;
      case 'diagonal':
        if (!considerDiagonal) break;
        drawing = drawDiagonal(drawing, line.start.y, line.end.y, line.start.x, line.end.x);
        break;
      default:
        break;
    }
  })
  return drawing;
}

function evaluate(drawing: number[][]): number {
  return drawing.reduce<number>((acc: number, row: number[]) => {
    if (row == null) return acc;
    return acc + row.reduce<number>((acc: number, value: number) => {
      if (value >= 2) acc++;
      return acc;
    }, 0)
  }, 0);
}

export function one(_input: string[]): number {
  const lines = formatInput(_input);
  const drawing = draw(lines);
  return evaluate(drawing);
}

export function two(_input: string[]): number {
  const lines = formatInput(_input);
  const drawing = draw(lines, true);
  return evaluate(drawing);
}
