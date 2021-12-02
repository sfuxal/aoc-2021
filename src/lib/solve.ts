import path from "path";
import { asArray } from "./input";

async function solve(
  dirname: string,
  part: string
): Promise<string | number | null> {
  const inputs = await asArray(
    path.join(process.cwd(), "src", dirname, "inputs.txt")
  );
  const module = require(path.join(process.cwd(), "dist", dirname));

  const solver: null | ((x: string[]) => string | number) = module[part];

  if (!solver) return null;
  return solver(inputs);
}

export default solve;
