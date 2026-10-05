import { cac } from "cac";
import ora from "ora";
import { renderPdf } from "@/render";

const cli = cac("curriculum-vitae");

cli
  .command("<descriptor> <output>", "Generate the PDF file of the curriculum")
  .action(async (descriptor: string, output: string) => {
    const spinner = ora(`Generating PDF in ${output}…`).start();
    try {
      await renderPdf(descriptor, output);
      spinner.succeed(`PDF successfully saved to ${output}.`);
    } catch (error) {
      spinner.fail(`Failed to generate PDF: ${error}`);
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
