import { toInt } from "../../lib/helpers";

/**
 * It wasn't specified what the bit will be if 1 and 0 are equally common
 * so I just decided for a version. 
 */

function toGammaBit(sum: number, length: number): string {
  return sum >= length / 2 ? '1' : '0'
}

function toEpsilonBit(sum: number, length: number): string {
  return sum >= length / 2 ? '0' : '1'
}

function toDecimal(array: string[]): number {
  return toInt(array.join(''), 2)
}

function addBitsToSums(sums: number[] = [], binary: string) {
  const bitArray = binary.split('');
  bitArray.forEach((bit: string, index: number) => {
    sums[index] = (sums[index] || 0) + toInt(bit);
  })
  return sums;
}

export function one(_input: string[]): number {
  const sums = _input.reduce<number[]>(addBitsToSums, [])

  const gammaArray = sums.map((sum) => toGammaBit(sum, _input.length));
  const epsilonArray = sums.map((sum) => toEpsilonBit(sum, _input.length));

  return toDecimal(gammaArray) * toDecimal(epsilonArray);
}

// -----------------------------------------------------------------------

type Buckets = {
  one: string[],
  zero: string[],
}

function makeBuckets(input: string[], index: number): Buckets {
  return input.reduce<Buckets>((acc: Buckets, binary: string) => {
    if (binary[index] === '1') acc.one.push(binary);
    else acc.zero.push(binary);
    return acc;
  }, { one: [], zero: [] })
}

function getRating(input: string[], binaryLength: number, kind: 'least common' | 'most common'): string {
  let results = input;
  let index = 0;

  /**
   * going for a while loop here cause it's a way we can cope for not having one value
   * but already being through all bits
   */
  while (results.length > 1) {
    const buckets: Buckets = makeBuckets(results, index);
    const condition = kind === 'most common'
      ? buckets.one.length >= buckets.zero.length
      : buckets.one.length < buckets.zero.length
    results = condition ? buckets.one : buckets.zero;
    /**
     * Wasn't specified but this is a fallback in case we reach the last bit but
     * haven't drilled down to one binary. I start over with the first bit in that case.
     */
    if (index === (binaryLength - 1)) index = 0;
    else index++;
  }
  return results[0];
}


export function two(_input: string[]): number {
  const binaryLength = _input[0].length;
  /**
   * Could also solve with one gigantic reduce. Would need to calculate both rates
   * during that one loop.
   */
  const oxygenRating = toInt(getRating(_input, binaryLength, 'most common'), 2);
  const co2Rating = toInt(getRating(_input, binaryLength, 'least common'), 2);
  return oxygenRating * co2Rating;
}
