import { cac } from "cac";
import ora from "ora";
import { descriptorJsonSchema } from "@/utils/descriptor";
import { writeTextFile } from "@/utils/file";

const cli = cac("curriculum-vitae");

cli
  .command("<output>", "Generate the JSON schema for the descriptor")
  .action(async (output: string) => {
    const spinner = ora(`Generating descriptor schema in ${output}…`).start();
    try {
      await writeTextFile(
        output,
        `${JSON.stringify(descriptorJsonSchema, null, 2)}\n`,
      );
      spinner.succeed(`Descriptor schema successfully saved to ${output}.`);
    } catch (error) {
      spinner.fail(`Failed to generate descriptor schema: ${error}`);
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
