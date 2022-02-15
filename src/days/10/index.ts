type Kind = 'opening' | 'closing';
type LegalChar = '(' | ')' | '[' | ']' | '{' | '}' | '<' | '>';
type Score = 0 | 3 | 57 | 1197 | 25137;
type CharInfo = {
  kind: Kind,
  partner: LegalChar,
  score: Score,
}

const charsInfo:Record<LegalChar, CharInfo> = {
  '(': {
    kind: 'opening',
    partner: ')',
    score: 3,
  },
  ')': {
    kind: 'closing',
    partner: '(',
    score: 3,
  },
  '[': {
    kind: 'opening',
    partner: ']',
    score: 57,
  },
  ']': {
    kind: 'closing',
    partner: '[',
    score: 57,
  },
  '{': {
    kind: 'opening',
    partner: '}',
    score: 1197,
  },
  '}': {
    kind: 'closing',
    partner: '{',
    score: 1197,
  },
  '<': {
    kind: 'opening',
    partner: '>',
    score: 25137,
  },
  '>': {
    kind: 'closing',
    partner: '<',
    score: 25137,
  },
}

function calcErrorScore(_characters:LegalChar[]):Score {
  const characters = [..._characters];

  let length = characters.length;
  let index = 0;
  let score:Score = 0;

  while (index < length) {
    const curChar = characters[index];
    const curCharInfo = charsInfo[curChar];

    if(curCharInfo.kind === 'opening') {
      index++;
      continue;
    }

    const prevChar = characters[index - 1];
    const isValidChunk = prevChar === curCharInfo.partner;

    if(isValidChunk) {
      characters.splice(index - 1, 2);
      length = length -2;
      index = index - 1;
    } else {
      score = curCharInfo.score;
      break;
    }
  }

  return score;
}

export function one(_input: string[]): number {
  const scores = _input.map((line) => calcErrorScore(line.split('') as LegalChar[]));
  return scores.reduce<number>((sum, score) => {
    sum = sum + score;
    return sum
  }, 0);
}

export function two(_input: string[]): number {
  return 0;
}
