import solve from "./lib/solve";

type Part = "one" | "two";

async function solveDay(num: string, part: Part): Promise<void> {
  console.log(`Day ${num} | Part ${part.toUpperCase()}`);
  const dir = `./days/${num}`;
  const solution = await solve(dir, part);
  if (solution == null) {
    console.log("Not solved!");
  } else {
    console.log(`Solution: ${solution}`);
  }
}

(async function () {
  try {
    const day = process.argv[process.argv.length - 1];
    await solveDay(day, "one");
    await solveDay(day, "two");
  } catch (err) {
    console.error(err);
  }
})();
