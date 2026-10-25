const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
const ws = new WebSocket(`${wsProtocol}//${location.host}`);

function computeViewBox(item, u) {
  const { inkX, inkY, inkW, inkH } = item;
  const cx = inkX + inkW / 2;
  const cy = inkY + inkH / 2;
  const maxInkDim = Math.max(inkW, inkH);

  let Vw;
  let Vh;
  if (u >= 0) {
    const R = 1.0 + u;
    Vh = Math.max(inkH, inkW / R);
    Vw = R * Vh;
  } else {
    const pad = -u * 1.5;
    Vh = maxInkDim * (1 + pad);
    Vw = Vh;
  }

  const minX = cx - Vw / 2;
  const minY = cy - Vh / 2;

  return {
    minX: Math.round(minX * 100) / 100,
    minY: Math.round(minY * 100) / 100,
    width: Math.round(Vw * 100) / 100,
    height: Math.round(Vh * 100) / 100,
  };
}

function applyViewBox(item, chipEl, vb) {
  const vbStr = `${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`;
  const svg = chipEl.querySelector("svg");
  svg.setAttribute("viewBox", vbStr);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        id: item.id,
        filePath: item.filePath,
        viewBox: vbStr,
      }),
    );
  }
}

async function init() {
  const res = await fetch("/api/items");
  const items = await res.json();

  for (const item of items) {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `${item.svgContent}<span class="chip-text" style="color: ${item.color}">${item.title}</span>`;

    document.body.appendChild(chip);

    const svg = chip.querySelector("svg");
    const group = svg.querySelector(".ink-group");
    let bbox;
    try {
      bbox = group ? group.getBBox() : svg.getBBox();
    } catch {
      bbox = {
        x: 0,
        y: 0,
        width: item.initialViewBox.width,
        height: item.initialViewBox.height,
      };
    }

    item.inkX = bbox.x;
    item.inkY = bbox.y;
    item.inkW = bbox.width > 0 ? bbox.width : item.initialViewBox.width;
    item.inkH = bbox.height > 0 ? bbox.height : item.initialViewBox.height;

    item.isWide = item.inkW > item.inkH;
    item.maxU = item.isWide ? 1.0 : 0.0;

    const curRatio = item.initialViewBox.width / item.initialViewBox.height;
    if (curRatio > 1.05) {
      item.u = Math.min(item.maxU, curRatio - 1.0);
    } else {
      const maxDim = Math.max(item.inkW, item.inkH);
      const pad = item.initialViewBox.height / maxDim - 1.0;
      item.u = pad > 0.02 ? Math.max(-2.5, -pad / 1.5) : 0;
    }

    chip.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const step = e.shiftKey ? 0.01 : 0.04;
        const delta = e.deltaY < 0 ? step : -step;
        item.u = Math.min(item.maxU, Math.max(-2.5, item.u + delta));
        const vb = computeViewBox(item, item.u);
        applyViewBox(item, chip, vb);
      },
      { passive: false },
    );
  }
}

window.addEventListener("beforeunload", () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
});

init();
