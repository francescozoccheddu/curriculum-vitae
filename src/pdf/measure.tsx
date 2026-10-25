import layoutDocument from "@react-pdf/layout";
import ReactPDF, { type DocumentProps } from "@react-pdf/renderer";
import { createContext, type ReactElement, useContext } from "react";

export type Rect = Readonly<{
  width: number;
  height: number;
}>;

export type MeasureEntry = Readonly<{
  /** Attach to `<View id={id}>` so the measurement pass can locate the node. `undefined` during the final render pass. */
  id: string | undefined;
  /** Measured bounding box from the first layout pass, or `undefined` during the measurement pass. */
  rect: Rect | undefined;
}>;

type MeasureContextValue = {
  readonly rects: ReadonlyMap<string, Rect> | null;
  nextScope: () => number;
  markRequested: () => void;
};

type LayoutNode = {
  readonly props?: { readonly id?: string };
  readonly box?: { readonly width?: number; readonly height?: number };
  readonly children?: readonly LayoutNode[];
};

const MEASURE_PREFIX = "__measure_";

const MeasureContext = createContext<MeasureContextValue | null>(null);

function createMeasureContextValue(
  rects: ReadonlyMap<string, Rect> | null,
): MeasureContextValue & { readonly hasRequests: () => boolean } {
  let scopeCounter = 0;
  let requested = false;
  return {
    rects,
    nextScope: () => scopeCounter++,
    markRequested: () => {
      requested = true;
    },
    hasRequests: () => requested,
  };
}

function collectMeasuredRects(node: LayoutNode, out: Map<string, Rect>): void {
  const id = node.props?.id;
  if (
    id?.startsWith(MEASURE_PREFIX) &&
    typeof node.box?.width === "number" &&
    typeof node.box?.height === "number"
  ) {
    out.set(id, { width: node.box.width, height: node.box.height });
  }
  if (node.children) {
    for (const child of node.children) {
      collectMeasuredRects(child, out);
    }
  }
}

/**
 * Returns a scoped measurement helper `(key) => { id, rect }`.
 * All scopes across the document are measured together in a single layout pre-pass.
 */
export function useMeasureScope(): (key: string | number) => MeasureEntry {
  const ctx = useContext(MeasureContext);
  if (!ctx) {
    return () => ({ id: undefined, rect: undefined });
  }
  const scopeId = ctx.nextScope();
  return (key: string | number): MeasureEntry => {
    const measureId = `${MEASURE_PREFIX}${scopeId}_${key}`;
    if (ctx.rects === null) {
      ctx.markRequested();
      return { id: measureId, rect: undefined };
    }
    return { id: undefined, rect: ctx.rects.get(measureId) };
  };
}

/**
 * Renders a PDF document, automatically performing a single Yoga/Fontkit layout
 * measurement pass beforehand if any component in the tree calls `useMeasureScope()`.
 */
export async function renderMeasuredPdf(
  renderDocument: () => ReactElement<DocumentProps>,
  outputFile: string,
): Promise<void> {
  const pass1Ctx = createMeasureContextValue(null);
  const pass1Element = (
    <MeasureContext.Provider value={pass1Ctx}>
      {renderDocument()}
    </MeasureContext.Provider>
  );

  const instance = ReactPDF.pdf(pass1Element);
  if (!pass1Ctx.hasRequests()) {
    await ReactPDF.render(renderDocument(), outputFile);
    return;
  }

  const runLayout = layoutDocument as unknown as (
    doc: unknown,
    fontStore: unknown,
  ) => Promise<LayoutNode>;
  const container = (
    instance as unknown as {
      readonly container: { readonly document: unknown };
    }
  ).container;
  const laidOut = await runLayout(container.document, ReactPDF.Font);

  const rects = new Map<string, Rect>();
  collectMeasuredRects(laidOut, rects);

  const pass2Ctx = createMeasureContextValue(rects);
  const pass2Element = (
    <MeasureContext.Provider value={pass2Ctx}>
      {renderDocument()}
    </MeasureContext.Provider>
  );
  await ReactPDF.render(pass2Element, outputFile);
}
