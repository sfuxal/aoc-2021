
type InsertionRules = Record<string, string>;

function formatInput(input: string[]): { template: string, insertionRules: InsertionRules } {
  const [template, _, ...rawRules] = input;
  const insertionRules: InsertionRules = {};
  rawRules.forEach((rule) => {
    const [pair, item] = rule.split(' -> ');
    insertionRules[pair] = item
  })

  return {
    template,
    insertionRules,
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

function countOccurrences(polymer: string) {
  const occurrences: Record<string, number> = {};
  for (let index = 0; index < polymer.length; index++) {
    const item = polymer[index];
    if (!occurrences[item]) occurrences[item] = 1;
    else occurrences[item]++;
  }
  return occurrences
}

function calcResult(occurrenceMap: Record<string, number>) {
  const sortedOccurrences = Object.values(occurrenceMap).sort((a, b) => b - a);
  return sortedOccurrences[0] - sortedOccurrences[sortedOccurrences.length - 1];
}

export function one(_input: string[]): number {
  const { template, insertionRules } = formatInput(_input);

  let step = 1;
  let polymer = template;

  while (step <= 10) {
    polymer = insert(polymer, insertionRules);
    step++;
  }

  const occurrenceMap = countOccurrences(polymer);
  return calcResult(occurrenceMap);
}

export function two(_input: string[]): number {
  return 0;
}
