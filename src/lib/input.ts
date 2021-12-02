import fs from "fs";
import readline from "readline";

export function asArray(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(path);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const lines: string[] = [];

    rl.on("line", (l) => {
      lines.push(l);
    });
    rl.on("close", () => {
      resolve(lines);
    });
    rl.on("error", (err) => {
      reject(err);
    });
  });
}
