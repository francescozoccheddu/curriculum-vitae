import { cac } from "cac";
import ora from "ora";
import { scaleIcons } from "@/icon-scaler";

const cli = cac("curriculum-vitae");

cli
  .command("<descriptor>", "Interactively scale tag icons in the browser")
  .action(async (descriptor: string) => {
    const spinner = ora("Running icon scaler…").start();
    try {
      const updatedCount = await scaleIcons(descriptor);
      spinner.succeed(
        `Icon scaler finished (${updatedCount} icon${updatedCount === 1 ? "" : "s"} updated).`,
      );
    } catch (error) {
      spinner.fail(`Failed to run icon scaler: ${error}`);
      process.exit(1);
    }
  });

cli.help();

try {
  cli.parse();
} catch (error) {
  ora().fail(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
