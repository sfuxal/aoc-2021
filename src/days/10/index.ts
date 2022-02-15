type Kind = 'opening' | 'closing';
type LegalChar = '(' | ')' | '[' | ']' | '{' | '}' | '<' | '>';
type Score = 0 | 3 | 57 | 1197 | 25137;
type Points = 1 | 2 | 3 | 4;
type CharInfo = {
  kind: Kind,
  partner: LegalChar,
  /** error score */
  score: Score,
  /** completion points */
  points: Points,
}

const charsInfo: Record<LegalChar, CharInfo> = {
  '(': {
    kind: 'opening',
    partner: ')',
    score: 3,
    points: 1,
  },
  ')': {
    kind: 'closing',
    partner: '(',
    score: 3,
    points: 1,
  },
  '[': {
    kind: 'opening',
    partner: ']',
    score: 57,
    points: 2,
  },
  ']': {
    kind: 'closing',
    partner: '[',
    score: 57,
    points: 2,
  },
  '{': {
    kind: 'opening',
    partner: '}',
    score: 1197,
    points: 3,
  },
  '}': {
    kind: 'closing',
    partner: '{',
    score: 1197,
    points: 3,
  },
  '<': {
    kind: 'opening',
    partner: '>',
    score: 25137,
    points: 4,
  },
  '>': {
    kind: 'closing',
    partner: '<',
    score: 25137,
    points: 4,
  },
}

function evaluateLine(_characters: LegalChar[]): { score: Score, incompleteChars: LegalChar[] } {
  const characters = [..._characters];

  let length = characters.length;
  let index = 0;
  let score: Score = 0;

  while (index < length) {
    const curChar = characters[index];
    const curCharInfo = charsInfo[curChar];

    if (curCharInfo.kind === 'opening') {
      index++;
      continue;
    }

    const prevChar = characters[index - 1];
    const isValidChunk = prevChar === curCharInfo.partner;

    if (isValidChunk) {
      characters.splice(index - 1, 2);
      length = length - 2;
      index = index - 1;
    } else {
      score = curCharInfo.score;
      break;
    }
  }
  return { score, incompleteChars: characters };
}

export function one(_input: string[]): number {
  const scores = _input.map((line) => evaluateLine(line.split('') as LegalChar[]).score);
  return scores.reduce<number>((sum, score) => {
    sum = sum + score;
    return sum
  }, 0);
}

export function two(_input: string[]): number {
  const charsToComplete: LegalChar[][] = [];
  _input.forEach((line) => {
    const { score, incompleteChars } = evaluateLine(line.split('') as LegalChar[]);
    if (score === 0) charsToComplete.push(incompleteChars);
  })

  const scores = charsToComplete.map((chars) => {
    const points: number[] = [];
    for (let index = (chars.length - 1); index >= 0; index--) {
      points.push(charsInfo[chars[index]].points);
    }

    return points.reduce<number>((acc, point) => {
      acc = acc * 5 + point
      return acc;
    }, 0)
  });

  const sortedScores = scores.sort((a, b) => b - a);
  const middleScore = sortedScores[Math.floor(scores.length / 2)];
  return middleScore;
}

