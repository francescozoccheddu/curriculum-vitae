import ReactPDF from "@react-pdf/renderer";
import { Content } from "@/content/Content";
import { loadDescriptorFile } from "@/utils/descriptor";

export async function renderPdf(
  descriptorFile: string,
  outputFile: string,
): Promise<NodeJS.ReadableStream> {
  const descriptor = await loadDescriptorFile(descriptorFile);
  const content = <Content descriptor={descriptor} />;
  return await ReactPDF.render(content, outputFile);
}
