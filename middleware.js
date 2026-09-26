export const config = { matcher: ["/"] };

export default async function middleware(request) {
  const sourceUrl = new URL("/index.html", request.url);
  let upstream;

  try {
    upstream = await fetch(sourceUrl);
  } catch {
    return new Response("Dinliminate could not load the app entry.", {
      status: 503,
      headers: {"content-type": "text/plain; charset=utf-8", "cache-control": "no-store"}
    });
  }

  if (!upstream.ok) return upstream;

  let html = await upstream.text();

  // Preserve the original P635/P63x premium product surface. This middleware only
  // applies the final clean-release layer so we do not fork or rewrite the large app.
  html = html
    .replace(/<script id="dinliminate-release-migration">[\\s\\S]*?<\\/script>\\s*/i, "")
    .replaceAll("./launch-hardening.css?v=p635", "./launch-hardening.css?v=p636-clean")
    .replaceAll("./launch-hardening.js?v=p635", "./launch-hardening.js?v=p636-clean")
    .replaceAll("const DINLIMINATE_VERSION = 'p635';", "const DINLIMINATE_VERSION = 'p636-clean';")
    .replaceAll("const V='p623';", "const V='p636-clean';")
    .replaceAll("Website / Order", "Website")
    .replaceAll("Search / Order", "Search")
    .replaceAll("Search/Order", "Search")
    .replace("Made by Brian Dunn for Devona Dunn.", "Made by Brian Dunn for Devona Dunn.");

  const cleanCss = '<link rel="stylesheet" href="./p636-clean-ui.css?v=p636-clean">';
  html = html.replace("</head>", cleanCss + "</head>");
  html = html.replace("<body>", '<body data-dinliminate-release="p636-clean">');

  const headers = new Headers(upstream.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store, max-age=0");
  headers.set("x-dinliminate-release", "p636-clean");

  return new Response(html, {
    status: upstream.status,
    headers
  });
}
