export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // mode ?url=
  let target = url.searchParams.get("url");

  // fallback: path-based
  if (!target) {
    const path = url.pathname.slice(1);
    if (path.startsWith("http://") || path.startsWith("https://")) {
      target = path;
    }
  }

  if (!target) {
    return new Response("Missing target url", { status: 400 });
  }

  try {
    const resp = await fetch(target, {
      headers: {
        "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0",
        "Referer": new URL(target).origin
      }
    });

    return new Response(resp.body, {
      status: resp.status,
      headers: resp.headers
    });
  } catch (e) {
    return new Response("Fetch error", { status: 502 });
  }
}
