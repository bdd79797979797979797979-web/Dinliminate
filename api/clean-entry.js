const fs = require("node:fs");
const path = require("node:path");

const CLEAN_VERSION = "p636-clean";
const ROOT = path.join(process.cwd());

function readAsset(name) {
  return fs.readFileSync(path.join(ROOT, name), "utf8");
}

function transform(html, assets) {
  return html
    .replace(/<script id="dinliminate-release-migration">[\s\S]*?<\/script>\s*/i, "")
    .replace(/<link\s+rel="stylesheet"\s+href="\.\/launch-hardening\.css\?v=p635"\s*\/?>(?:\s*)/i,
      '<style id="dinliminate-launch-hardening-css">'+assets.launchCss+'</style>')
    .replace(/<script\s+src="\.\/launch-hardening\.js\?v=p635"\s+defer\s*><\/script>/i,
      '<script id="dinliminate-launch-hardening-js">'+assets.launchJs+'</script>')
    .replace(/<link\s+rel="stylesheet"\s+href="\.\/p636-clean-ui\.css\?v=p636-clean"\s*\/?>(?:\s*)/i, "")
    .replace("</head>",
      '<style id="dinliminate-p636-clean-ui">'+assets.cleanCss+'</style></head>')
    .replaceAll("const DINLIMINATE_VERSION = 'p635';", "const DINLIMINATE_VERSION = '"+CLEAN_VERSION+"';")
    .replaceAll("const V='p623';", "const V='"+CLEAN_VERSION+"';")
    .replaceAll("Website / Order", "Website")
    .replaceAll("Search / Order", "Search")
    .replaceAll("Search/Order", "Search")
    .replace("<body>", '<body data-dinliminate-release="'+CLEAN_VERSION+'">');
}

function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  try {
    const html = readAsset("index.html");
    const assets = {
      launchCss: readAsset("launch-hardening.css"),
      launchJs: readAsset("launch-hardening.js"),
      cleanCss: readAsset("p636-clean-ui.css"),
    };
    const output = transform(html, assets);
    res.status(200);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("X-Dinliminate-Release", CLEAN_VERSION);
    return res.send(output);
  } catch (error) {
    console.error("clean-entry", error);
    return res.status(503).send("Dinliminate could not load the app entry.");
  }
}

module.exports = handler;
