export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export function getSvgViewBox(svg: string): ViewBox {
  let rawViewBox: string | null = null;
  new HTMLRewriter()
    .on("svg", {
      element(el) {
        rawViewBox = el.getAttribute("viewBox");
      },
    })
    .transform(svg);

  if (rawViewBox) {
    const parts = (rawViewBox as string)
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
      return {
        minX: parts[0] as number,
        minY: parts[1] as number,
        width: parts[2] as number,
        height: parts[3] as number,
      };
    }
  }
  return { minX: 0, minY: 0, width: 24, height: 24 };
}

export function setSvgViewBox(svg: string, viewBox: string): string {
  return new HTMLRewriter()
    .on("svg", {
      element(el) {
        el.setAttribute("viewBox", viewBox);
      },
    })
    .transform(svg);
}

export function prepareSvgForPdf(
  svg: string,
  color: string,
  height: number,
): string {
  const vb = getSvgViewBox(svg);
  const width = Math.round(height * (vb.width / vb.height) * 100) / 100;
  return new HTMLRewriter()
    .on("svg", {
      element(el) {
        el.setAttribute("width", String(width));
        el.setAttribute("height", String(height));
      },
    })
    .on("[fill]", {
      element(el) {
        if (el.getAttribute("fill")?.toLowerCase() !== "none") {
          el.setAttribute("fill", color);
        }
      },
    })
    .transform(svg);
}

export function colorizeSvg(svg: string, color: string): string {
  return new HTMLRewriter()
    .on("[fill]", {
      element(el) {
        if (el.getAttribute("fill")?.toLowerCase() !== "none") {
          el.setAttribute("fill", color);
        }
      },
    })
    .transform(svg);
}

export function wrapSvgContent(svg: string, groupClass: string): string {
  return new HTMLRewriter()
    .on("svg", {
      element(el) {
        el.prepend(`<g class="${groupClass}">`, { html: true });
        el.append("</g>", { html: true });
      },
    })
    .transform(svg);
}
