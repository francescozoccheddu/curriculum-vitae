import sharp from "sharp";
import { PDF_POINTS_PER_INCH } from "@/pdf/theme";

export async function prepareImageForPdf(
  file: string,
  sizePt: number,
  dpi: number,
): Promise<string> {
  const sizePx = Math.round((sizePt / PDF_POINTS_PER_INCH) * dpi);
  const image = sharp(file);
  const metadata = await image.metadata();
  const resized = image.resize(sizePx, sizePx, {
    fit: "cover",
    position: "centre",
  });
  if (metadata.hasAlpha) {
    const buffer = await resized.png({ compressionLevel: 9 }).toBuffer();
    return `data:image/png;base64,${new Uint8Array(buffer).toBase64()}`;
  }
  const buffer = await resized
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${new Uint8Array(buffer).toBase64()}`;
}
