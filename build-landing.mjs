// Post-build step: layer the Framer static export (www.datafurnishing.com-framer/)
// on top of the Vite SPA build in dist/.
//
// - The SPA entry (dist/index.html) is renamed to dist/app.html; vercel.json
//   rewrites all non-static routes to it.
// - The Framer HTML is copied with ONLY loading-strategy / CTA wiring changes:
//     * preconnect + dns-prefetch for Framer CDNs
//     * hero image eager/high priority; below-fold images lazy
//     * one bodyEnd CTA-bridge script (Login / Start Building / Request Access)
// - The source export files in www.datafurnishing.com-framer/ are never modified.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const exportDir = path.join(root, "www.datafurnishing.com-framer");

const SPEED_HINTS = `<!-- df-speed-hints -->
<link rel="preconnect" href="https://framerusercontent.com" crossorigin>
<link rel="preconnect" href="https://events.framer.com" crossorigin>
<link rel="dns-prefetch" href="https://framerusercontent.com">
<link rel="dns-prefetch" href="https://events.framer.com">
`;

const CTA_BRIDGE = `<script id="df-cta-bridge">
(function () {
  var MAP = {
    "login": "/auth-login",
    "start building": "/auth-register",
    "request access": "/auth-register"
  };
  document.addEventListener("click", function (e) {
    var node = e.target;
    for (var i = 0; i < 8 && node && node !== document.body; i++) {
      var text = (node.textContent || "").trim().toLowerCase();
      if (MAP[text]) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = MAP[text];
        return;
      }
      node = node.parentElement;
    }
  }, true);
})();
</script>`;

function injectSpeedHints(html) {
  if (html.includes("df-speed-hints")) return html;
  if (html.includes("</head>")) {
    return html.replace("</head>", SPEED_HINTS + "</head>");
  }
  return html;
}

function optimizeImages(html) {
  let heroDone = false;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    // Leave data: / SVG logos alone beyond optional lazy.
    const isRemoteRaster =
      /src=["']https:\/\/framerusercontent\.com\/images\/[^"']+\.(webp|png|jpe?g)/i.test(tag);

    if (isRemoteRaster && !heroDone) {
      heroDone = true;
      let next = tag;
      if (/loading=/i.test(next)) {
        next = next.replace(/loading=["'][^"']*["']/i, 'loading="eager"');
      } else {
        next = next.replace("<img", '<img loading="eager"');
      }
      if (/fetchpriority=/i.test(next)) {
        next = next.replace(/fetchpriority=["'][^"']*["']/i, 'fetchpriority="high"');
      } else {
        next = next.replace("<img", '<img fetchpriority="high"');
      }
      return next;
    }

    if (/loading=/i.test(tag)) return tag;
    // Below-fold / unmarked images: lazy load.
    return tag.replace("<img", '<img loading="lazy"');
  });
}

function injectCtaBridge(html) {
  const slot = "<!-- Start of bodyEnd -->";
  if (html.includes(slot)) {
    return html.replace(slot, slot + "\n" + CTA_BRIDGE);
  }
  return html.replace("</body>", CTA_BRIDGE + "\n</body>");
}

const spaIndex = path.join(dist, "index.html");
const spaApp = path.join(dist, "app.html");
if (!fs.existsSync(spaIndex)) {
  console.error("[landing] dist/index.html not found — run `vite build` first");
  process.exit(1);
}
fs.renameSync(spaIndex, spaApp);

function copyLandingPage(relPath) {
  const src = path.join(exportDir, relPath);
  const dest = path.join(dist, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let html = fs.readFileSync(src, "utf-8");
  html = injectSpeedHints(html);
  html = optimizeImages(html);
  html = injectCtaBridge(html);
  fs.writeFileSync(dest, html);
  console.log(`[landing] ${relPath} → dist/${relPath}`);
}

copyLandingPage("index.html");
copyLandingPage(path.join("legal", "privacy-policy.html"));

console.log("[landing] SPA entry: dist/app.html  |  Landing: dist/index.html");
