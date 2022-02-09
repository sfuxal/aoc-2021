import { toInt } from "../../lib/helpers";

type Conditions = { [digit: number]: (pattern: string) => boolean }

export function one(_input: string[]): number {
  const outputValues = _input
    .map((line) => line.split(' | ')[1].split(' '))
    .flat()
  const uniqueNumberOutputs = outputValues
    .filter((val) => [2, 4, 3, 7].includes(val.length));
  return uniqueNumberOutputs.length;
}

function sortString(val: string): string {
  return val.split('').sort().join('')
}

/**
 * Checks how many letters of one string are also included in another one.
 */
function getMatchingLettersCount(shortVal: string, longVal: string): number {
  let count = 0;
  for (let index = 0; index < shortVal.length; index++) {
    if (longVal.includes(shortVal[index])) count++;
  }
  return count;
}

/**
 * Checks if a given string (candidate) includes the letters of a second string at any position.
 */
function includesLetters(candidate: string, letters: string): boolean {
  return letters.split('').every((letter) => candidate.includes(letter))
}

function formatInputLine(inputLine: string): { patterns: string[], outputValues: string[] } {
  const [rawPatterns, rawOutputValues] = inputLine.split(' | ');
  // Sort strings already alphabetically so comparing them is easier later on.
  const patterns = rawPatterns.split(' ').map(sortString);
  const outputValues = rawOutputValues.split(' ').map(sortString);
  return { patterns, outputValues };
}

function makeDecoder(patterns: string[]): string[] {
  const decoder: string[] = [];

  /**
   *   0:      1:      2:      3:      4:
   *   aaaa    ....    aaaa    aaaa    ....
   *  b    c  .    c  .    c  .    c  b    c
   *  b    c  .    c  .    c  .    c  b    c
   *   ....    ....    dddd    dddd    dddd
   *  e    f  .    f  e    .  .    f  .    f
   *  e    f  .    f  e    .  .    f  .    f
   *   gggg    ....    gggg    gggg    ....
   *  
   *    5:      6:      7:      8:      9:
   *   aaaa    aaaa    aaaa    aaaa    aaaa
   *  b    .  b    .  .    c  b    c  b    c
   *  b    .  b    .  .    c  b    c  b    c
   *   dddd    dddd    ....    dddd    dddd
   *  .    f  e    f  .    f  e    f  .    f
   *  .    f  e    f  .    f  e    f  .    f
   *   gggg    gggg    ....    gggg    gggg
   * 
   * Some digits can be easily identified cause their length is unique (digit[length]):
   * 1[2], 4[4], 7[3], 8[7]
   * 
   * The others need to be distinguished with extended conditions:
   *  Those have a length of [6]
   *  - 9 includes every letter from 4 (plus 2 more)
   *  - 0 includes every letter from 1
   *  - 6 is the last one with a length of 6 and doesn't meet the conditions of 0 and 9
   * 
   *  Those have a length of [5]
   *  - 3 includes every letter from 1
   *  - 5 has 3 letters that match the pattern of the 4 digit
   *  - 2 doesn't meet those conditions and shares 2 letters with the 4 digit pattern
   */
  const conditions: Conditions = {
    0: (pattern: string) => pattern.length === 6
      && includesLetters(pattern, decoder[1])
      && !includesLetters(pattern, decoder[4]),
    1: (pattern: string) => pattern.length === 2,
    2: (pattern: string) => pattern.length === 5
      && !includesLetters(pattern, decoder[1])
      && getMatchingLettersCount(decoder[4], pattern) === 2,
    3: (pattern: string) => pattern.length === 5
      && includesLetters(pattern, decoder[1]),
    4: (pattern: string) => pattern.length === 4,
    5: (pattern: string) => pattern.length === 5
      && !includesLetters(pattern, decoder[1])
      && getMatchingLettersCount(decoder[4], pattern) === 3,
    6: (pattern: string) => pattern.length === 6
      && !includesLetters(pattern, decoder[4])
      && !includesLetters(pattern, decoder[1]),
    7: (pattern: string) => pattern.length === 3,
    8: (pattern: string) => pattern.length === 7,
    9: (pattern: string) => pattern.length === 6
      && includesLetters(pattern, decoder[4]),
  }
  // the order matters cause some conditions depend on other decoder entries being present
  const order: number[] = [1, 4, 7, 8, 9, 0, 6, 3, 5, 2];

  order.forEach((digit) => {
    const code = patterns.find(conditions[digit]);
    if (code) decoder[digit] = code;
  })

  return decoder;
}

export function two(_input: string[]): number {
  const decodedOutputs = _input.map((inputLine) => {
    const { patterns, outputValues } = formatInputLine(inputLine);
    const decoder = makeDecoder(patterns);

    let decodedOutput = '';
    outputValues.forEach((pattern) => {
      const index = decoder.findIndex((p) => p === pattern);
      decodedOutput = decodedOutput + index.toString();
    })
    return decodedOutput;
  })

  return decodedOutputs.reduce((acc, digit) => {
    acc = acc + toInt(digit);
    return acc;
  }, 0);
}
