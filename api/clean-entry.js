import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLEAN_VERSION = "p636-clean";
const HERE = path.dirname(fileURLToPath(import.meta.url));

async function readAsset(name) {
  return fs.readFile(path.join(HERE, "..", name), "utf8");
}

function transform(html, assets) {
  const css = assets.launchCss;
  const js = assets.launchJs;
  const cleanCss = assets.cleanCss;

  return html
    .replace(/<script id="dinliminate-release-migration">[\s\S]*?<\/script>\s*/i, "")
    .replace(/<link\s+rel="stylesheet"\s+href="\.\/launch-hardening\.css\?v=p635"\s*\/?>(?:\s*)/i,
      '<style id="dinliminate-launch-hardening-css">'+css+'</style>')
    .replace(/<script\s+src="\.\/launch-hardening\.js\?v=p635"\s+defer\s*><\/script>/i,
      '<script id="dinliminate-launch-hardening-js">'+js+'</script>')
    .replace("</head>",
      '<style id="dinliminate-p636-clean-ui">'+cleanCss+'</style></head>')
    .replaceAll("const DINLIMINATE_VERSION = 'p635';", "const DINLIMINATE_VERSION = '"+CLEAN_VERSION+"';")
    .replaceAll("const V='p623';", "const V='"+CLEAN_VERSION+"';")
    .replaceAll("Website / Order", "Website")
    .replaceAll("Search / Order", "Search")
    .replaceAll("Search/Order", "Search")
    .replace("<body>", '<body data-dinliminate-release="'+CLEAN_VERSION+'">');
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).setHeader("allow", "GET, HEAD").send("Method not allowed");
    return;
  }

  try {
    const [html, launchCss, launchJs, cleanCss] = await Promise.all([
      readAsset("index.html"),
      readAsset("launch-hardening.css"),
      readAsset("launch-hardening.js"),
      readAsset("p636-clean-ui.css"),
    ]);

    const output = transform(html, { launchCss, launchJs, cleanCss });

    res.status(200);
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "no-store, max-age=0");
    res.setHeader("x-dinliminate-release", CLEAN_VERSION);
    res.send(output);
  } catch (error) {
    console.error("clean-entry", error);
    res.status(503).send("Dinliminate could not load the app entry.");
  }
}
