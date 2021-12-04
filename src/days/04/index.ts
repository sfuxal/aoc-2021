export function one(_input: string[]): number {
  const [rawDrawInput, _, ...rawBoardsInput] = _input;
  const drawInput = rawDrawInput.split(',');

  let boardIndex = 0;
  const boards: string[][][] = [];
  for (let index = 0; index < rawBoardsInput.length; index++) {
    if (rawBoardsInput[index].length) {
      boards[boardIndex] = [
        ...(boards[boardIndex] || []),
        rawBoardsInput[index].split(' ')
      ]
    } else {
      boardIndex++;
    }
  }

  console.log({ drawInput, boards })
  return 0;
}

export function two(_input: string[]): number {
  return 0;
}
