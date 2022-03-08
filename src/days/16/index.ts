type LiteralPackage = {
  binary: string,
  version: number,
  typeId: 4,
  type: 'literal',
  value: number,
  subPackages: Package[],
}

type OperatorPackageBase = {
  binary: string,
  version: number,
  typeId: Omit<number, 4>,
  type: 'operator',
  subPackages: Package[],
}

type OperatorCountPackage = OperatorPackageBase & {
  lengthTypeId: '1',
  lengthType: 'count',
  subPackagesCount: number,
}

type OperatorLengthPackage = OperatorPackageBase & {
  lengthTypeId: '0',
  lengthType: 'length',
  subPackagesLength: number,
}

type Package = LiteralPackage | OperatorCountPackage | OperatorLengthPackage;

const hexBinMapping: Record<string, string> = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111',
}

const typeIdOperationMapping: Record<number, (subPackageValues: number[]) => number> = {
  0: (subPackageValues: number[]) => subPackageValues.reduce((res, val) => res + val, 0), // sum
  1: (subPackageValues: number[]) => subPackageValues.reduce((res, val) => res * val, 1), // product
  2: (subPackageValues: number[]) => Math.min(...subPackageValues), // min
  3: (subPackageValues: number[]) => Math.max(...subPackageValues), // max
  5: (subPackageValues: number[]) => subPackageValues[0] > subPackageValues[1] ? 1 : 0, // greater than
  6: (subPackageValues: number[]) => subPackageValues[0] < subPackageValues[1] ? 1 : 0, // less than
  7: (subPackageValues: number[]) => subPackageValues[0] === subPackageValues[1] ? 1 : 0, // equal
}

function hex2bin(hex: string): string {
  return hex.split('').map((h) => hexBinMapping[h]).join('')
}

function evaluateLiteralValue(binary: string): { value: number, packageLength: number } {
  const body = binary.substring(6);
  let litValBinary = '';
  let stop = false;
  let index = 0;

  while (!stop) {
    const curGroup = body.substring(index, index + 5);
    litValBinary = litValBinary + curGroup.substring(1);
    if (curGroup[0] === '0') stop = true;
    index = index + 5;
  }

  return {
    value: parseInt(litValBinary, 2),
    packageLength: index + 6, // 6 = first three bits which are the header
  };
}

function getTotalPackageLength(packageItem: Package) {
  if (!packageItem.subPackages.length) return packageItem.binary.length;
  return packageItem.binary.length + packageItem.subPackages.reduce((sum, item) => {
    const length = getTotalPackageLength(item);
    sum += length;
    return sum;
  }, 0)
}

function getVersionSum(packageItem: Package) {
  if (!packageItem.subPackages.length) return packageItem.version;
  return packageItem.version + packageItem.subPackages.reduce((sum, item) => {
    const versionSum = getVersionSum(item)
    sum += versionSum;
    return sum
  }, 0)
}

// TODO split it into small peaces and make it functional
function evaluatePackage(binary: string, curPackageStartIndex: number): Package {
  const versionBinary = binary.substring(curPackageStartIndex, curPackageStartIndex + 3)
  const version = parseInt(versionBinary, 2);

  const typeIdBinary = binary.substring(curPackageStartIndex + 3, curPackageStartIndex + 6);
  const typeId = parseInt(typeIdBinary, 2);
  const type = typeId === 4 ? 'literal' : 'operator'

  let packageBinary = versionBinary + typeIdBinary;
  let typeSpecificAttr = {};

  if (type === 'literal') {
    const { value, packageLength } = evaluateLiteralValue(binary.substring(curPackageStartIndex));
    typeSpecificAttr = { value, subPackages: [] };
    packageBinary = binary.substring(curPackageStartIndex, curPackageStartIndex + packageLength);
    curPackageStartIndex += packageLength;
  }

  if (type === 'operator') {
    const lengthTypeId = binary[curPackageStartIndex + 6];
    const lengthType = lengthTypeId === '0' ? 'length' : 'count';

    packageBinary += lengthTypeId;
    typeSpecificAttr = {
      lengthTypeId,
      lengthType,
    }

    let lengthTypeSpecificAttr = {};

    if (lengthType === 'count') {
      const lengthBinary = binary.substring(curPackageStartIndex + 7, curPackageStartIndex + 7 + 11);
      const subPackagesCount = parseInt(lengthBinary, 2);
      packageBinary += lengthBinary;

      const subPackages: Package[] = [];

      let evaluatedSubPackages = 0;
      curPackageStartIndex += (7 + 11);

      while (evaluatedSubPackages < subPackagesCount) {
        const newPackage = evaluatePackage(binary, curPackageStartIndex);
        subPackages.push(newPackage);
        evaluatedSubPackages++;
        curPackageStartIndex += getTotalPackageLength(newPackage);
      }

      lengthTypeSpecificAttr = {
        subPackagesCount,
        subPackages
      };
    }

    if (lengthType === 'length') {
      const lengthBinary = binary.substring(curPackageStartIndex + 7, curPackageStartIndex + 7 + 15);
      const subPackagesLength = parseInt(lengthBinary, 2);
      packageBinary += lengthBinary;

      const subPackages: Package[] = [];

      let evaluatedSubPackagesLength = 0;
      curPackageStartIndex += (7 + 15);

      while (evaluatedSubPackagesLength < subPackagesLength) {
        const newPackage = evaluatePackage(binary, curPackageStartIndex);
        subPackages.push(newPackage);
        const packageLength = getTotalPackageLength(newPackage);
        evaluatedSubPackagesLength += packageLength;
        curPackageStartIndex += packageLength;
      }

      lengthTypeSpecificAttr = {
        subPackagesLength,
        subPackages
      };
    }

    typeSpecificAttr = {
      ...typeSpecificAttr,
      ...lengthTypeSpecificAttr
    }
  }

  return {
    version,
    typeId,
    type,
    binary: packageBinary,
    ...typeSpecificAttr
  } as Package;
}


export function one(_input: string[]): number {
  const binary = hex2bin(_input[0]);

  const packageStructure = evaluatePackage(binary, 0);

  const versionSum = getVersionSum(packageStructure);
  return versionSum;
}

function makeOperation(packageItem: Package): number {
  if (packageItem.type === 'literal') return packageItem.value;
  return typeIdOperationMapping[packageItem.typeId as number](packageItem.subPackages.map(makeOperation))
}

export function two(_input: string[]): number {
  const binary = hex2bin(_input[0]);

  const packageStructure = evaluatePackage(binary, 0);
  const res = makeOperation(packageStructure);
  return res;
}
