import ReactPDF from "@react-pdf/renderer";
import { Content, DEFAULT_TAG_COLOR } from "@/content/Content";
import { type Descriptor, loadDescriptorFile } from "@/utils/descriptor";
import { readTextFile } from "@/utils/file";

async function colorizeDescriptorLogos(
  descriptor: Descriptor,
): Promise<Descriptor> {
  if (!descriptor.tags || descriptor.tags.length === 0) {
    return descriptor;
  }
  const colors = new Map((descriptor.colors ?? []).map((c) => [c.id, c.color]));
  const tags = await Promise.all(
    descriptor.tags.map(async (tag) => {
      if (!tag.logo?.endsWith(".svg")) {
        return tag;
      }
      if (!(await Bun.file(tag.logo).exists())) {
        return tag;
      }
      const color =
        (tag.color ? colors.get(tag.color) : null) ?? DEFAULT_TAG_COLOR;
      const svg = await readTextFile(tag.logo);
      const coloredSvg = svg.replace(
        /fill="(?!none)[^"]*"/gi,
        `fill="${color}"`,
      );
      const dataUri = `data:image/svg+xml;base64,${Buffer.from(coloredSvg).toString("base64")}`;
      return { ...tag, logo: dataUri };
    }),
  );
  return { ...descriptor, tags };
}

export async function renderPdf(
  descriptorFile: string,
  outputFile: string,
): Promise<NodeJS.ReadableStream> {
  const rawDescriptor = await loadDescriptorFile(descriptorFile);
  const descriptor = await colorizeDescriptorLogos(rawDescriptor);
  const content = <Content descriptor={descriptor} />;
  return await ReactPDF.render(content, outputFile);
}
