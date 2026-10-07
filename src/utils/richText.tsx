import { Text } from "@react-pdf/renderer";
import { createElement, Fragment, type ReactNode } from "react";

export type RichTextMark = "bold" | "italic";

export type RichTextNode =
  | string
  | Readonly<{ mark: RichTextMark; children: readonly RichTextNode[] }>;

/** Characters that toggle a mark. Marks can be nested but must not overlap. */
const MARKERS: Readonly<Record<string, RichTextMark>> = {
  "§": "bold",
  _: "italic",
};

/** Makes the next character literal (e.g. `\_` or `\§`). */
const ESCAPE = "\\";

const MARK_STYLES = {
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
} as const satisfies Record<RichTextMark, object>;

type Frame = {
  mark: RichTextMark | null;
  children: RichTextNode[];
  buffer: string;
};

function flush(frame: Frame): void {
  if (frame.buffer) {
    frame.children.push(frame.buffer);
    frame.buffer = "";
  }
}

/**
 * Parses a string where segments wrapped in `§` are bold and segments wrapped
 * in `_` are italic into a tree of nodes.
 * @throws If a mark is left open or marks overlap without nesting.
 */
export function parseRichText(text: string): RichTextNode[] {
  const root: Frame = { mark: null, children: [], buffer: "" };
  const stack: Frame[] = [root];
  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i] as string;
    const frame = stack.at(-1) as Frame;
    if (char === ESCAPE && i + 1 < chars.length) {
      frame.buffer += chars[++i];
      continue;
    }
    const mark = MARKERS[char];
    if (!mark) {
      frame.buffer += char;
      continue;
    }
    flush(frame);
    if (frame.mark === mark) {
      stack.pop();
      (stack.at(-1) as Frame).children.push({ mark, children: frame.children });
    } else if (stack.some((f) => f.mark === mark)) {
      throw new Error(`Overlapping "${mark}" mark in rich text: "${text}"`);
    } else {
      stack.push({ mark, children: [], buffer: "" });
    }
  }
  if (stack.length > 1) {
    const open = (stack.at(-1) as Frame).mark;
    throw new Error(`Unclosed "${open}" mark in rich text: "${text}"`);
  }
  flush(root);
  return root.children;
}

function renderNodes(nodes: readonly RichTextNode[]): ReactNode[] {
  return nodes.map((node) =>
    typeof node === "string"
      ? node
      : createElement(
          Text,
          { style: MARK_STYLES[node.mark] },
          ...renderNodes(node.children),
        ),
  );
}

/**
 * Converts a rich text string (see {@link parseRichText}) into a JSX tree.
 * The result must be placed inside a `<Text>` element.
 */
export function richText(text: string): ReactNode {
  return createElement(Fragment, null, ...renderNodes(parseRichText(text)));
}
