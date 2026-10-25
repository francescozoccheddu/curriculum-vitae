import { Content, DEFAULT_TAG_COLOR } from "@/pdf/Content";
import { renderMeasuredPdf } from "@/pdf/measure";
import { LOGO_HEIGHT, MONOCHROME_TAGS } from "@/pdf/theme";
import { type Descriptor, loadDescriptorFile } from "@/utils/descriptor";
import { fileExists, readTextFile } from "@/utils/file";
import { prepareSvgForPdf } from "@/utils/svg";

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
      if (!(await fileExists(tag.logo))) {
        return tag;
      }
      const color =
        (!MONOCHROME_TAGS && tag.color ? colors.get(tag.color) : null) ??
        DEFAULT_TAG_COLOR;
      const svg = await readTextFile(tag.logo);
      const preparedSvg = prepareSvgForPdf(svg, color, LOGO_HEIGHT);
      const base64 = new TextEncoder().encode(preparedSvg).toBase64();
      const dataUri = `data:image/svg+xml;base64,${base64}`;
      return { ...tag, logo: dataUri };
    }),
  );
  return { ...descriptor, tags };
}

export async function renderPdf(
  descriptorFile: string,
  outputFile: string,
): Promise<void> {
  const rawDescriptor = await loadDescriptorFile(descriptorFile);
  const descriptor = await colorizeDescriptorLogos(rawDescriptor);
  await renderMeasuredPdf(
    () => <Content descriptor={descriptor} />,
    outputFile,
  );
}
