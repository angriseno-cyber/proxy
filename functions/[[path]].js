export async function onRequest(context) {
  const { request } = context;
  const reqUrl = new URL(request.url);

  // ambil target dari PATH saja
  const target = decodeURIComponent(reqUrl.pathname.slice(1));

  if (
    !target ||
    (!target.startsWith("http://") && !target.startsWith("https://"))
  ) {
    return new Response("Invalid target url", { status: 400 });
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid target url", { status: 400 });
  }

  // headers ke origin
  const forwardHeaders = {
    "accept": "*/*",
    "user-agent":
      request.headers.get("user-agent") ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  };

  // fetch ke target
  const resp = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: forwardHeaders,
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : request.body
  });

  // clone response headers
  const resHeaders = new Headers(resp.headers);

  // === CORS MAGIC ===
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
