import ReactPDF from "@react-pdf/renderer";
import { Content } from "@/Content";

export function renderPdf(outputFile: string): Promise<NodeJS.ReadableStream> {
  return ReactPDF.render(<Content />, outputFile);
}
