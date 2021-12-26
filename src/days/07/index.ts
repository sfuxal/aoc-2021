import { toInt } from "../../lib/helpers";

function getSortedFrequencies(locations: number[]): { location: number, frequency: number }[] {
  const frequencies: Record<number, number> = {};
  locations.forEach((location) => {
    if (!frequencies[location]) frequencies[location] = 1;
    else frequencies[location]++;
  })
  return Object.keys(frequencies)
    .map((location) => ({
      location: toInt(location),
      frequency: frequencies[toInt(location)]
    }))
    .sort((a, b) => b.frequency - a.frequency)
}

function getFuelCost(locations:number[], posToAlign:number):number {
   return locations.reduce((acc:number, location) => {
    return acc + Math.abs(location - posToAlign);
  }, 0)
}

export function one(_input: string[]): number {
  const locations = _input[0].split(',').map((l) => toInt(l));
  const sortedFrequencies = getSortedFrequencies(locations);
  let fuelCost;
  for (let index = 0; index < (sortedFrequencies.length / 4); index++) {
    const cost = getFuelCost(locations, sortedFrequencies[index].location);
    if(!fuelCost || cost < fuelCost) fuelCost = cost;
  }
  if(!fuelCost) throw new Error('Unexpected error');
  return fuelCost;
}

export function two(_input: string[]): number {
  return 0;
}
