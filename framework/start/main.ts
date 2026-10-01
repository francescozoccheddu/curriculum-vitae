import { cac } from "cac";
import { renderPdf } from "framework/start/render";
import ora from "ora";

const cli = cac("curriculum-vitae");

cli
  .command("[output]", "Generate the PDF file of the curriculum")
  .action(async (output = "./cv.pdf") => {
    const spinner = ora(`Generating PDF in ${output}…`).start();
    try {
      await renderPdf(output);
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
