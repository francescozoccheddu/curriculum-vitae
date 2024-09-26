import { Canvas, choosers, positioners } from '@francescozoccheddu/2d-bin-packing';
import { Random } from 'random';
import { roundCorners } from 'svg-round-corners';

type Word = Readonly<{
  text: string;
  value: number;
}>

type Skill = Readonly<{
  alt: boolean;
  title: string;
  words: readonly Word[];
  seed: number | null;
  minSize: number;
  maxSize: number;
}>

type Skills = Readonly<Record<'bottomLeft' | 'topLeft' | 'bottomRight' | 'topRight', Skill>>

declare const __skillsWords__: Skills;

export function setupSkillsWords(): void {
  const roots = Array.from(document.getElementsByClassName('skills-words')) as HTMLElement[] as readonly HTMLElement[];
  roots.forEach(appendSkillSets);
}

function appendSkillSets(rootEl: HTMLElement): void {
  const [w, h] = [rootEl.offsetWidth, rootEl.offsetHeight];
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.setAttribute('width', w.toString());
  svgEl.setAttribute('height', h.toString());
  rootEl.append(svgEl);
  const gap = w * 0.01;
  const [sw, sh] = [(w - gap) / 2, (h - gap) / 2];

  const rectsAndKeys: readonly (readonly [rect: DOMRect, key: keyof Skills])[] = [
    [new DOMRect(0, 0, sw, sh), 'topLeft'],
    [new DOMRect(sw + gap, 0, sw, sh), 'topRight'],
    [new DOMRect(0, sh + gap, sw, sh), 'bottomLeft'],
    [new DOMRect(sw + gap, sh + gap, sw, sh), 'bottomRight'],
  ];

  for (const [rect, key] of rectsAndKeys) {
    const skill = __skillsWords__[key];
    appendSkillSet(svgEl, rect, skill);
  }

}

function appendSkillSet(svgEl: SVGSVGElement, rect: DOMRect, skill: Skill): void {
  const [w, h] = [rect.width, rect.height];
  const cornerRadius = 0.01 * w;
  const textPadding = 0.01 * w;
  const [tpx, tpy] = [textPadding * 1.1, textPadding];

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  if (skill.alt) {
    g.classList.add('alt');
  }

  svgEl.append(g);
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textEl.classList.add('label');
  textEl.textContent = skill.title;
  g.append(textEl);
  const textBB = textEl.getBBox();
  const [nw, nh] = [textBB.width + (tpx + cornerRadius) * 2, textBB.height + tpy * 2];
  textEl.setAttribute('x', (rect.x + tpx + cornerRadius).toString());
  textEl.setAttribute('y', (rect.y - textBB.y + tpy).toString());

  const cardFgEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  cardFgEl.classList.add('card-fg');
  const path = `M${rect.x},${rect.y + nh}v${h - nh}h${w}v${-h}h${-w + nw}v${nh}z`;
  cardFgEl.setAttribute('d', roundCorners(path, cornerRadius).path);
  cardFgEl.setAttribute('vector-effect', 'non-scaling-stroke');
  g.append(cardFgEl);

  const cardBgEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  cardBgEl.classList.add('card-bg');
  cardBgEl.setAttribute('x', rect.x.toString());
  cardBgEl.setAttribute('y', rect.y.toString());
  cardBgEl.setAttribute('width', rect.width.toString());
  cardBgEl.setAttribute('height', rect.height.toString());
  cardBgEl.setAttribute('rx', cornerRadius.toString());
  g.prepend(cardBgEl);
  const pad = cornerRadius * 3;
  const notchPad = cornerRadius * 2;
  appendWordClouds(
    g,
    new DOMRect(rect.x + pad, rect.y + pad, rect.width - pad * 2, rect.height - pad * 2),
    new DOMRect(rect.x, rect.y, nw + notchPad, nh + notchPad),
    [skill.minSize, skill.maxSize],
    skill.words,
    skill.seed,
  );
}

function appendWordClouds(svgEl: SVGGElement, rect: DOMRect, labelRect: DOMRect, size: readonly [number, number], words: readonly Word[], seed: number | null): void {
  const [minSize, maxSize] = size;
  const [minOpacity, maxOpacity] = [0.6, 1];
  const maxValue = Math.max(...words.map(w => w.value));
  const items = words.map(w => {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const sizeP = w.value / maxValue;
    const size = (1 - sizeP) * minSize + sizeP * maxSize;
    const opacity = (1 - sizeP) * minOpacity + sizeP * maxOpacity;
    textEl.classList.add('skill');
    textEl.textContent = w.text;
    textEl.setAttribute('font-size', size.toString());
    textEl.setAttribute('opacity', opacity.toString());
    svgEl.append(textEl);
    return textEl;
  });
  if (!layoutWordCloudsN(rect, labelRect, items, seed, seed === null ? 10000 : 1)) {
    items.forEach(i => i.remove());
  }
}

function layoutWordCloudsN(rect: DOMRect, labelRect: DOMRect, items: readonly SVGTextElement[], seed: number | null, maxRetries: number): boolean {
  while (maxRetries > 0) {
    const thisSeed = seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    if (layoutWordClouds(rect, labelRect, items, thisSeed)) {
      if (seed === null) {
        console.log('Skill word cloud seed', thisSeed, items[0]?.textContent);
      }
      return true;
    }
    maxRetries--;
    if (seed !== null) {
      seed++;
    }
  }
  return false;
}

function layoutWordClouds(rect: DOMRect, labelRect: DOMRect, items: readonly SVGTextElement[], seed: number): boolean {
  const relPadding = 0.05;
  const absPadding = 1.5;
  const paddingAspect = 1.5;
  const canvas = new Canvas({
    leftX: rect.x,
    bottomY: rect.y,
    width: rect.width,
    height: rect.height,
  }, {
    chooser: choosers.center,
    positioner: positioners.canvasCenter,
  });
  canvas.occupy({
    leftX: labelRect.x,
    bottomY: labelRect.y,
    width: labelRect.width,
    height: labelRect.height,
  });
  const random = new Random(seed);
  const mutItems = [...items];
  for (let i = mutItems.length - 1; i > 0; i--) {
    const j = random.uniformInt(0, i)();
    const old = mutItems[j]!;
    mutItems[j] = mutItems[i]!;
    mutItems[i] = old;
  }
  for (const item of mutItems) {
    const bbox = item.getBBox();
    const padding = bbox.height * relPadding + absPadding;
    const rect = canvas.push({ width: bbox.width + padding * 2, height: bbox.height + padding * 2 / paddingAspect });
    if (!rect) {
      return false;
    }
    item.setAttribute('x', (rect.leftX + padding).toString());
    item.setAttribute('y', (rect.bottomY + rect.height - padding).toString());
  }
  return true;
}