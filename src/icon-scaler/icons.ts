import { DEFAULT_TAG_COLOR } from "@/pdf/theme";
import { loadDescriptorFile } from "@/utils/descriptor";
import { fileExists, readTextFile, writeTextFile } from "@/utils/file";
import {
  colorizeSvg,
  getSvgViewBox,
  setSvgViewBox,
  type ViewBox,
  wrapSvgContent,
} from "@/utils/svg";

export interface IconItem {
  id: string;
  title: string;
  color: string;
  filePath: string;
  svgContent: string;
  initialViewBox: ViewBox;
}

export async function loadIconItems(
  descriptorPath: string,
): Promise<IconItem[]> {
  const descriptor = await loadDescriptorFile(descriptorPath);
  const colorsMap = new Map(
    (descriptor.colors ?? []).map((c) => [c.id, c.color]),
  );

  const seenLogos = new Set<string>();
  const items: IconItem[] = [];

  for (const tag of descriptor.tags ?? []) {
    if (!tag.logo || seenLogos.has(tag.logo)) {
      continue;
    }
    seenLogos.add(tag.logo);

    if (!(await fileExists(tag.logo))) {
      continue;
    }

    const color =
      (tag.color ? colorsMap.get(tag.color) : null) ?? DEFAULT_TAG_COLOR;
    const svgRaw = await readTextFile(tag.logo);

    items.push({
      id: tag.id,
      title: tag.title,
      color,
      filePath: tag.logo,
      svgContent: wrapSvgContent(colorizeSvg(svgRaw, color), "ink-group"),
      initialViewBox: getSvgViewBox(svgRaw),
    });
  }

  return items;
}

export async function saveUpdatedViewBoxes(
  updates: ReadonlyMap<string, { filePath: string; viewBox: string }>,
): Promise<number> {
  let count = 0;
  for (const [, { filePath, viewBox }] of updates) {
    const content = await readTextFile(filePath);
    await writeTextFile(filePath, setSvgViewBox(content, viewBox));
    count++;
  }
  return count;
}
