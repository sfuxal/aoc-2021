type InsertionRules = Record<string, string>; // 'CH': 'B'
type CreatedPairsByPair = Record<string, string[]>; // 'CH': ['CB', 'BH']
type Occurrence = Record<string, number>; // {'CB': 2} || { 'B': 5 }

function formatInput(input: string[]): {
  template: string, insertionRules: InsertionRules, createdPairsByPair: CreatedPairsByPair
} {
  const [template, _, ...rawRules] = input;
  const insertionRules: InsertionRules = {};
  const createdPairsByPair: CreatedPairsByPair = {};

  rawRules.forEach((rule) => {
    const [pair, item] = rule.split(' -> ');
    insertionRules[pair] = item;
    createdPairsByPair[pair] = [`${pair[0]}${item}`, `${item}${pair[1]}`];
  })

  return {
    template,
    insertionRules,
    createdPairsByPair,
  }
}

function insert(polymer: string, insertionRules: InsertionRules) {
  const items = polymer.split('');
  let index = 0;
  while (items[index + 1]) {
    const pair = `${items[index]}${items[index + 1]}`;
    const insertItem = insertionRules[pair];
    items.splice(index + 1, 0, insertItem);
    index = index + 2;
  }
  return items.join('');
}

function increaseOrInsert(map: Record<string, number>, key: string, increaseAmount: number = 1) {
  map[key] = map[key]
    ? map[key] += increaseAmount
    : increaseAmount;
}

function countOccurrences(polymer: string): { occurrences: Occurrence, pairOccurrences: Occurrence } {
  const occurrences: Occurrence = {};
  const pairOccurrences: Occurrence = {};
  for (let index = 0; index < polymer.length; index++) {
    const curItem = polymer[index];
    increaseOrInsert(occurrences, curItem)

    const nextItem = polymer[index + 1];
    if (nextItem) {
      const pair = `${curItem}${nextItem}`;
      increaseOrInsert(pairOccurrences, pair);
    }
  }
  return { occurrences, pairOccurrences }
}

function calcResult(occurrenceMap: Record<string, number>) {
  const sortedOccurrences = Object.values(occurrenceMap).sort((a, b) => b - a);
  return sortedOccurrences[0] - sortedOccurrences[sortedOccurrences.length - 1];
}

function simulatePolymer(
  template: string,
  insertionRules: InsertionRules,
  createdPairsByPair: CreatedPairsByPair,
  stepCount: number
) {
  const {
    occurrences: itemOccurrences,
    pairOccurrences: initialPairOccurrence
  } = countOccurrences(template);

  let lastPairOccurrences = initialPairOccurrence;
  let step = 1;

  while (step <= stepCount) {
    const newPairOccurrences: Occurrence = {};
    const occurringPairs = Object.keys(lastPairOccurrences);

    occurringPairs.forEach((pair) => {
      const pairCount = lastPairOccurrences[pair];
      const insertingItem = insertionRules[pair];
      const [emergingPair1, emergingPair2] = createdPairsByPair[pair];

      increaseOrInsert(itemOccurrences, insertingItem, pairCount);
      increaseOrInsert(newPairOccurrences, emergingPair1, pairCount);
      increaseOrInsert(newPairOccurrences, emergingPair2, pairCount);
    })

    lastPairOccurrences = newPairOccurrences
    step++;
  }

  return itemOccurrences;
}

export function one(_input: string[]): number {
  const { template, insertionRules } = formatInput(_input);

  let step = 1;
  let polymer = template;

  while (step <= 10) {
    polymer = insert(polymer, insertionRules);
    step++;
  }

  const { occurrences: occurrenceMap } = countOccurrences(polymer);
  return calcResult(occurrenceMap);
}

export function two(_input: string[]): number {
  const { template, insertionRules, createdPairsByPair } = formatInput(_input);

  const occurrences = simulatePolymer(template, insertionRules, createdPairsByPair, 40);

  return calcResult(occurrences);
}
