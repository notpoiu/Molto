"use strict";

const LOADER_URL = "https://molto.pages.dev/source.lua";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);

// The moon icon of each set (Iconify JSON, same data the registry is built from), so the diagram never waits on a request
const MOONS = {"lucide":{"name":"moon","w":24,"h":24,"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>"},"tabler":{"name":"moon","w":24,"h":24,"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z\"/>"},"heroicons":{"name":"moon","w":24,"h":24,"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M21.752 15.002A9.7 9.7 0 0 1 18 15.75A9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.75 9.75 0 0 0 3 11.25A9.75 9.75 0 0 0 12.75 21a9.75 9.75 0 0 0 9.002-5.998\"/>"},"ph":{"name":"moon","w":256,"h":256,"body":"<path fill=\"currentColor\" d=\"M233.54 142.23a8 8 0 0 0-8-2a88.08 88.08 0 0 1-109.8-109.8a8 8 0 0 0-10-10a104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.1 103.1 0 0 0 62.52-20.88a104.84 104.84 0 0 0 37-52.91a8 8 0 0 0-1.98-7.98m-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104a106 106 0 0 0 14.92-1.06a89 89 0 0 1-26.02 31.4\"/>"},"fluent":{"name":"weather-moon-24-regular","w":24,"h":24,"body":"<path fill=\"currentColor\" d=\"M20.026 17.001c-2.762 4.784-8.879 6.423-13.663 3.661A10 10 0 0 1 3.13 17.68a.75.75 0 0 1 .365-1.132c3.767-1.348 5.785-2.91 6.956-5.146c1.233-2.353 1.551-4.93.689-8.463a.75.75 0 0 1 .769-.927a9.96 9.96 0 0 1 4.457 1.327c4.784 2.762 6.423 8.879 3.66 13.662m-8.247-4.903c-1.252 2.389-3.312 4.1-6.818 5.499a8.5 8.5 0 0 0 2.152 1.766a8.502 8.502 0 0 0 8.502-14.725a8.5 8.5 0 0 0-2.792-1.015c.647 3.384.23 6.043-1.045 8.475\"/>"},"feather":{"name":"moon","w":24,"h":24,"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79\"/>"},"fontawesome":{"name":"moon","w":640,"h":640,"body":"<path fill=\"currentColor\" d=\"M320 64C178.6 64 64 178.6 64 320s114.6 256 256 256c68.8 0 131.3-27.2 177.3-71.4c7.3-7 9.4-17.9 5.3-27.1s-13.7-14.9-23.8-14.1c-4.9.4-9.8.6-14.8.6c-101.6 0-184-82.4-184-184c0-72.1 41.5-134.6 102.1-164.8c9.1-4.5 14.3-14.3 13.1-24.4s-8.6-18.3-18.5-20.5C358.4 66.2 339.4 64 320 64\"/>"}};
const LOGOS = {"lucide":{"vb":"0 0 24 24","body":"<path fill=\"currentColor\" d=\"M18.483 1.123a1.1 1.1 0 0 0-.752.362a1.09 1.09 0 0 0 .088 1.54a11.96 11.96 0 0 1 4 8.946a7.62 7.62 0 0 1-7.637 7.636a7.62 7.62 0 0 1-7.637-7.636a3.255 3.255 0 0 1 3.273-3.273c1.82 0 3.273 1.45 3.273 3.273a1.09 1.09 0 0 0 1.09 1.09a1.09 1.09 0 0 0 1.092-1.09c0-3-2.455-5.455-5.455-5.455s-5.454 2.455-5.454 5.455c0 5.408 4.408 9.818 9.818 9.818S24 17.379 24 11.971A14.16 14.16 0 0 0 19.272 1.4a1.1 1.1 0 0 0-.789-.277M9.818 2.15C4.408 2.151 0 6.561 0 11.97a14.16 14.16 0 0 0 4.8 10.637a1.09 1.09 0 0 0 1.54-.096a1.09 1.09 0 0 0-.095-1.54a11.96 11.96 0 0 1-4.063-9a7.62 7.62 0 0 1 7.636-7.637a7.62 7.62 0 0 1 7.637 7.636a3.256 3.256 0 0 1-3.273 3.273a3.256 3.256 0 0 1-3.273-3.273a1.09 1.09 0 0 0-1.09-1.09a1.09 1.09 0 0 0-1.092 1.09c0 3 2.455 5.455 5.455 5.455s5.454-2.455 5.454-5.455c0-5.408-4.408-9.818-9.818-9.818z\"/>"},"tabler":{"vb":"0 0 68 68","body":"<path fill=\"#066fd1\" d=\"M64.6 16.2C63 9.9 58.1 5 51.8 3.4 40 1.5 28 1.5 16.2 3.4 9.9 5 5 9.9 3.4 16.2 1.5 28 1.5 40 3.4 51.8 5 58.1 9.9 63 16.2 64.6c11.8 1.9 23.8 1.9 35.6 0C58.1 63 63 58.1 64.6 51.8c1.9-11.8 1.9-23.8 0-35.6zM33.3 36.3c-2.8 4.4-6.6 8.2-11.1 11-1.5.9-3.3.9-4.8.1s-2.4-2.3-2.5-4c0-1.7.9-3.3 2.4-4.1 2.3-1.4 4.4-3.2 6.1-5.3-1.8-2.1-3.8-3.8-6.1-5.3-2.3-1.3-3-4.2-1.7-6.4s4.3-2.9 6.5-1.6c4.5 2.8 8.2 6.5 11.1 10.9 1 1.4 1 3.3.1 4.7zM49.2 46H37.8c-2.1 0-3.8-1-3.8-3s1.7-3 3.8-3h11.4c2.1 0 3.8 1 3.8 3s-1.7 3-3.8 3z\"/>"},"heroicons":{"vb":"0 47 62.2 68","body":"<path fill=\"#8B5CF6\" fill-rule=\"evenodd\" d=\"M31.059 48L33.4319 50.2574C39.4133 55.9473 47.4809 59.432 56.3663 59.432C56.5077 59.432 56.649 59.4311 56.79 59.4294L59.3207 59.3978L60.1112 61.8128C61.4143 65.7941 62.1179 70.0446 62.1179 74.4532C62.1179 93.302 49.2835 109.131 31.9191 113.62L31.059 113.843L30.1988 113.62C12.8344 109.131 0 93.302 0 74.4532C0 70.0446 0.703574 65.7941 2.00672 61.8128L2.7972 59.3978L5.32792 59.4294C5.46894 59.4311 5.61019 59.432 5.75166 59.432C14.637 59.432 22.7046 55.9473 28.686 50.2574L31.059 48ZM7.89346 66.3085C7.24622 68.913 6.90199 71.6407 6.90199 74.4532C6.90199 89.7494 17.1086 102.659 31.0589 106.671C45.0093 102.659 55.2159 89.7494 55.2159 74.4532C55.2159 71.6407 54.8717 68.913 54.2245 66.3085C45.4708 65.8472 37.454 62.5752 31.059 57.3783C24.6639 62.5752 16.6471 65.8472 7.89346 66.3085Z\"/>"},"ph":{"vb":"0 0 24 24","body":"<path fill=\"currentColor\" d=\"M12.404.001H3.866a.62.62 0 0 0-.619.619v15.173A8.217 8.217 0 0 0 11.449 24a.617.617 0 0 0 .618-.619v-6.969h.332a8.2 8.2 0 0 0 7.715-5.031a8.22 8.22 0 0 0 0-6.349A8.21 8.21 0 0 0 12.399.001zm-1.579 22.736a6.98 6.98 0 0 1-6.317-6.317h6.317zm0-9.562L4.869 1.238h5.967zm1.579 2h-.331V1.238h.331a6.98 6.98 0 0 1 5.016 1.993a7 7 0 0 1 1.546 2.277a7 7 0 0 1 0 5.397a6.975 6.975 0 0 1-6.562 4.27\"/>"},"material":{"vb":"0 0 24 24","body":"<path fill=\"currentColor\" d=\"M12 24a12 12 0 0 1-4.691-.927a12.6 12.6 0 0 1-3.818-2.564A12.6 12.6 0 0 1 .928 16.69A12 12 0 0 1 0 12q0-2.509.927-4.69a12.2 12.2 0 0 1 2.564-3.792A12 12 0 0 1 7.309.955A11.7 11.7 0 0 1 11.999 0q2.51 0 4.692.955a11.7 11.7 0 0 1 3.79 2.563a11.7 11.7 0 0 1 2.564 3.791Q23.999 9.492 24 12q0 2.482-.955 4.69a12 12 0 0 1-2.563 3.819a12.2 12.2 0 0 1-3.791 2.564Q14.509 24 12 24m-7.637-5.864V5.864A9.5 9.5 0 0 0 2.755 8.7q-.572 1.556-.572 3.3c0 1.744.19 2.273.572 3.327a9.6 9.6 0 0 0 1.609 2.81zm1.5-13.772h12.3a9.5 9.5 0 0 0-2.836-1.61A9.7 9.7 0 0 0 12 2.183q-1.746 0-3.327.573a9.6 9.6 0 0 0-2.81 1.609M12 14.727l4.118-8.181h-8.21Zm1.09 2.727h4.364V8.728Zm-6.545 0h4.364L6.545 8.728Zm8.782 3.791a9.5 9.5 0 0 0 2.836-1.609h-12.3a9.6 9.6 0 0 0 2.81 1.61a9.7 9.7 0 0 0 3.326.572a9.7 9.7 0 0 0 3.328-.573m4.309-3.109a9.6 9.6 0 0 0 1.609-2.809A9.7 9.7 0 0 0 21.817 12q0-1.745-.572-3.3a9.5 9.5 0 0 0-1.61-2.836Z\"/>"},"solar":{"vb":"0 0 24 24","body":"<g fill=\"currentColor\"><path d=\"M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z\"/><path fill-rule=\"evenodd\" d=\"M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM3.66865 3.71609C3.94815 3.41039 4.42255 3.38915 4.72825 3.66865L6.95026 5.70024C7.25596 5.97974 7.2772 6.45413 6.9977 6.75983C6.7182 7.06553 6.2438 7.08677 5.9381 6.80727L3.71609 4.77569C3.41039 4.49619 3.38915 4.02179 3.66865 3.71609ZM20.3314 3.71609C20.6109 4.02179 20.5896 4.49619 20.2839 4.77569L18.0619 6.80727C17.7562 7.08677 17.2818 7.06553 17.0023 6.75983C16.7228 6.45413 16.744 5.97974 17.0497 5.70024L19.2718 3.66865C19.5775 3.38915 20.0518 3.41039 20.3314 3.71609ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM17.0255 17.0252C17.3184 16.7323 17.7933 16.7323 18.0862 17.0252L20.3082 19.2475C20.6011 19.5404 20.601 20.0153 20.3081 20.3082C20.0152 20.6011 19.5403 20.601 19.2475 20.3081L17.0255 18.0858C16.7326 17.7929 16.7326 17.3181 17.0255 17.0252ZM6.97467 17.0253C7.26756 17.3182 7.26756 17.7931 6.97467 18.086L4.75244 20.3082C4.45955 20.6011 3.98468 20.6011 3.69178 20.3082C3.39889 20.0153 3.39889 19.5404 3.69178 19.2476L5.91401 17.0253C6.2069 16.7324 6.68177 16.7324 6.97467 17.0253ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z\" clip-rule=\"evenodd\"/></g>"},"fluent":{"vb":"0 0 24 24","body":"<path fill=\"#f25022\" d=\"M0 0h11.4v11.4H0z\"/><path fill=\"#7fba00\" d=\"M12.6 0H24v11.4H12.6z\"/><path fill=\"#00a4ef\" d=\"M0 12.6h11.4V24H0z\"/><path fill=\"#ffb900\" d=\"M12.6 12.6H24V24H12.6z\"/>"},"feather":{"vb":"0 0 24 24","body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22m15.5-7H9\"/>"},"fontawesome":{"vb":"0 0 24 24","body":"<path fill=\"currentColor\" d=\"M4.393 4.5a2.438 2.438 0 1 0-2.8-.141V24h3v-3h17.513c.684 0 1.238-.554 1.238-1.237a1.2 1.2 0 0 0-.107-.503l-2.893-6.51l2.893-6.51a1.2 1.2 0 0 0 .107-.503c0-.683-.554-1.237-1.238-1.237Z\"/>"}};
const ORDER = ["lucide", "tabler", "heroicons", "ph", "fluent", "solar", "material", "feather", "fontawesome"];
const LABELS = { lucide: "Lucide", tabler: "Tabler", heroicons: "Heroicons", ph: "Phosphor", fluent: "Fluent UI", solar: "Solar", material: "Material Symbols", feather: "Feather", fontawesome: "Font Awesome" };
const IDS = { ph: "phosphor" };
const NS = "http://www.w3.org/2000/svg";

//--// Toast \--//
const toastEl = $("toast");
let toastTimer;
function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("on"), 1800);
}

$("copy").addEventListener("click", async () => {
  const text = `local Icons = loadstring(game:HttpGet("${LOADER_URL}"))()\nIcons.SetProvider("lucide")\n\nlocal icon = Icons.GetAsset("moon")`;
  try {
    await navigator.clipboard.writeText(text);
    toast("Loader copied");
  } catch {
    toast("Copy blocked by the browser");
  }
});

//--// ASCII moon \--//
// The moon photo, sampled to a grid and dithered with a Bayer matrix so the maria and craters read in characters.
(function ascii() {
  const out = $("ascii");
  const COLS = 120, ROWS = 72;
  const RAMP = " .,:;ox%#@";
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const image = new Image();
  image.src = "assets/moon-photo.webp";
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = COLS;
    canvas.height = ROWS;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, COLS, ROWS);
    const pixels = ctx.getImageData(0, 0, COLS, ROWS).data;
    const lines = [];
    for (let y = 0; y < ROWS; y++) {
      let line = "";
      for (let x = 0; x < COLS; x++) {
        const i = (y * COLS + x) * 4;
        let light = (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255;
        light = Math.min(1, Math.max(0, (light - 0.06) * 1.35));
        const level = light * (RAMP.length - 1) + (BAYER[y % 4][x % 4] / 16 - 0.5) * 0.9;
        line += RAMP[Math.min(RAMP.length - 1, Math.max(0, Math.round(level)))];
      }
      lines.push(line);
    }
    if (REDUCED) {
      out.textContent = lines.join("\n");
      return;
    }
    // Reveal row by row from the top, like a scan
    let shown = 0;
    const tick = () => {
      shown = Math.min(ROWS, shown + 2);
      out.textContent = lines.slice(0, shown).join("\n");
      if (shown < ROWS) requestAnimationFrame(tick);
    };
    tick();
  };
})();

//--// Beam diagram \--//
const svg = $("beam-svg");
const el = (name, attrs = {}, parent = svg) => {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  parent.appendChild(node);
  return node;
};
const glyph = (parent, key, cx, cy, size) => {
  const moon = MOONS[key];
  const g = el("svg", { x: cx - size / 2, y: cy - size / 2, width: size, height: size, viewBox: `0 0 ${moon.w} ${moon.h}`, class: "glyph" }, parent);
  g.innerHTML = moon.body;
};

const defs = el("defs");
const grad = el("linearGradient", { id: "beamgrad", gradientUnits: "userSpaceOnUse", x1: 0, x2: 800, y1: 0, y2: 0 }, defs);
el("stop", { offset: "0", "stop-color": "#ff5a1f" }, grad);
el("stop", { offset: "1", "stop-color": "#ffd2ad" }, grad);

const HUB = { x: 400, y: 395 };
const SPOTS = [
  { x: 90, y: 55 }, { x: 90, y: 225 }, { x: 90, y: 395 }, { x: 90, y: 565 }, { x: 90, y: 735 },
  { x: 710, y: 140 }, { x: 710, y: 310 }, { x: 710, y: 480 }, { x: 710, y: 650 },
];
const counts = {};
const on = new Set(ORDER);
const totalEl = $("total");
let shownTotal = 0;
let raf;

function animateTotal() {
  const target = [...on].reduce((sum, key) => sum + (counts[key] || 0), 0);
  cancelAnimationFrame(raf);
  const from = shownTotal;
  const start = performance.now();
  const step = (now) => {
    const t = REDUCED ? 1 : Math.min(1, (now - start) / 500);
    shownTotal = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)));
    totalEl.textContent = shownTotal.toLocaleString();
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

const tracks = [];
ORDER.forEach((key, i) => {
  const s = SPOTS[i];
  const left = s.x < HUB.x;
  const from = { x: s.x + (left ? 52 : -52), y: s.y };
  const to = { x: HUB.x + (left ? -50 : 50), y: HUB.y + (s.y - HUB.y) * 0.25 };
  const mid = (from.x + to.x) / 2;
  const d = `M${from.x} ${from.y} C${mid} ${from.y} ${mid} ${to.y} ${to.x} ${to.y}`;
  const group = el("g", { class: "path" });
  el("path", { d, class: "track" }, group);
  const pulse = el("path", { d, class: "pulse", style: `animation-delay:${-i * 0.6}s` }, group);
  tracks[i] = pulse;
});

const hub = el("g", { class: "hub" });
el("circle", { cx: HUB.x, cy: HUB.y, r: 58 }, hub);
glyph(hub, "lucide", HUB.x, HUB.y, 56);
el("text", { x: HUB.x, y: HUB.y + 92, "text-anchor": "middle", fill: "currentColor", style: "fill:#f3ede4;font:700 22px 'Libre Franklin',sans-serif" }, hub).textContent = "Molto";

ORDER.forEach((key, i) => {
  const s = SPOTS[i];
  const node = el("g", { class: "node", role: "button", tabindex: 0, "aria-pressed": "true", "aria-label": LABELS[key] });
  el("circle", { cx: s.x, cy: s.y, r: 52 }, node);
  const logo = LOGOS[key];
  const size = 54;
  const g = el("svg", { x: s.x - size / 2, y: s.y - size / 2, width: size, height: size, viewBox: logo.vb, class: "glyph" }, node);
  g.innerHTML = logo.body;
  el("text", { x: s.x, y: s.y + 82 }, node).textContent = LABELS[key];
  node.count = el("text", { x: s.x, y: s.y + 104, class: "n" }, node);
  node.count.textContent = "";
  const toggle = () => {
    const state = !on.has(key);
    state ? on.add(key) : on.delete(key);
    node.setAttribute("aria-pressed", String(state));
    tracks[i].style.opacity = state ? 1 : 0;
    animateTotal();
  };
  node.addEventListener("click", toggle);
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); }
  });
  node.dataset.key = key;
});

(async () => {
  try {
    const response = await fetch("data/providers.json");
    const { providers } = await response.json();
    for (const p of providers) {
      const key = p.id === "phosphor" ? "ph" : p.id;
      counts[key] = p.count;
      const node = svg.querySelector(`.node[data-key="${key}"]`);
      if (node) node.count.textContent = `${p.count.toLocaleString()} icons`;
    }
    animateTotal();
  } catch {
    totalEl.textContent = "9,500+";
  }
})();

//--// Entrance \--//
const targets = document.querySelectorAll(".hero-copy > *, .load h2, .beam");
targets.forEach((node, i) => { node.classList.add("rise"); node.style.setProperty("--i", i % 4); });
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
}, { threshold: 0.15 });
targets.forEach((node) => io.observe(node));
