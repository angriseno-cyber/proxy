export async function onRequest({ request }) {
  const reqUrl = new URL(request.url);

  // ambil path tanpa slash awal
  const path = reqUrl.pathname.slice(1);

  if (!path) {
    return new Response("Proxy ready", { status: 200 });
  }

  // bentuk target URL (default https)
  const target = "https://" + path;

  let resp;
  try {
    resp = await fetch(target, {
      method: request.method,
      headers: {
        "accept": "*/*",
        "user-agent":
          request.headers.get("user-agent") ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : request.body
    });
  } catch (e) {
    return new Response("Fetch error", { status: 502 });
  }

  const headers = new Headers(resp.headers);

  // === CORS Anywhere style ===
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "*");
  headers.set("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");

  // preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  return new Response(resp.body, {
    status: resp.status,
    headers
  });
}
