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


export function two(_input: string[]): number {
  const binaryLength = _input[0].length;

  const results = {
    oxygen: _input,
    co2: _input,
  }
  let index = 0;

  /**
   * going for a while loop here cause it's a way we can cope for not having one value
   * but already being through all bits
   */
  while(results.oxygen.length > 1 || results.co2.length > 1) {
    if(results.oxygen.length > 1) {
      const oxygenBuckets: Buckets = makeBuckets(results.oxygen, index);
      results.oxygen = oxygenBuckets.one.length >= oxygenBuckets.zero.length
        ? oxygenBuckets.one
        : oxygenBuckets.zero;
    }

    if(results.co2.length > 1) {
      const co2Buckets: Buckets = makeBuckets(results.co2, index);
      results.co2 = co2Buckets.one.length < co2Buckets.zero.length
        ? co2Buckets.one
        : co2Buckets.zero;
    }

    /**
     * Wasn't specified but this is a fallback in case we reach the last bit but
     * haven't drilled down to one binary. I start over with the first bit in that case.
     */
    if (index === (binaryLength - 1)) index = 0;
    else index++;
  }

  const oxygenRating = toInt(results.oxygen[0], 2);
  const co2Rating = toInt(results.co2[0], 2);

  return oxygenRating * co2Rating;
}