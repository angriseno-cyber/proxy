export async function onRequest(context) {
  const { request } = context;
  const reqUrl = new URL(request.url);

  // ambil target
  let target = reqUrl.searchParams.get("url");
  if (!target) {
    const path = reqUrl.pathname.slice(1);
    if (path.startsWith("http://") || path.startsWith("https://")) {
      target = path;
    }
  }

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  // clone headers request (opsional)
  const headers = new Headers({
    "user-agent": request.headers.get("user-agent") || "Mozilla/5.0",
    "accept": "*/*"
  });

  // fetch ke origin
  const resp = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : request.body
  });

  // clone response headers
  const resHeaders = new Headers(resp.headers);

  // === MAGIC CORS ===
  resHeaders.set("Access-Control-Allow-Origin", "*");
  resHeaders.set("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  resHeaders.set("Access-Control-Allow-Headers", "*");
  resHeaders.set("Access-Control-Expose-Headers", "*");

  // preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: resHeaders
    });
  }

  return new Response(resp.body, {
    status: resp.status,
    headers: resHeaders
  });
}
