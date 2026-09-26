const RAW_BASE = "https://raw.githubusercontent.com/bdd79797979797979797979-web/Dinliminate/p636-online-baseline";
const CLEAN_VERSION = "p636-clean";

async function rawText(path) {
  const response = await fetch(RAW_BASE + "/" + path, {
    headers: { accept: "text/plain,text/css,*/*" },
  });
  if (!response.ok) throw new Error(path + " HTTP " + response.status);
  return response.text();
}

function transform(html, cleanCss) {
  return html
    .replace(/<script id="dinliminate-release-migration">[\s\S]*?<\/script>\s*/i, "")
    .replace(/<link\s+rel="stylesheet"\s+href="\.\/launch-hardening\.css\?v=p635"\s*\/?>(?:\s*)/i, "")
    .replace(/<script\s+src="\.\/launch-hardening\.js\?v=p635"\s+defer\s*><\/script>/i, "")
    .replace("</head>", '<style id="dinliminate-p636-clean-ui">'+cleanCss+"</style></head>")
    .replaceAll("const DINLIMINATE_VERSION = 'p635';", "const DINLIMINATE_VERSION = '"+CLEAN_VERSION+"';")
    .replaceAll("const V='p623';", "const V='"+CLEAN_VERSION+"';")
    .replaceAll("Website / Order", "Website")
    .replaceAll("Search / Order", "Search")
    .replaceAll("Search/Order", "Search")
    .replace("<body>", '<body data-dinliminate-release="'+CLEAN_VERSION+'">');
}

async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  try {
    const [html, cleanCss] = await Promise.all([
      rawText("index.html"),
      rawText("p636-clean-ui.css"),
    ]);
    const output = transform(html, cleanCss);
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
