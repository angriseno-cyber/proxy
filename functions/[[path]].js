export async function onRequest({ request }) {
  const reqUrl = new URL(request.url);

  const target = decodeURIComponent(reqUrl.pathname.slice(1));

  if (
    !target ||
    (!target.startsWith("http://") && !target.startsWith("https://"))
  ) {
    return new Response("Invalid target url", { status: 400 });
  }

  const resp = await fetch(target, {
    headers: {
      "user-agent":
        request.headers.get("user-agent") ||
        "Mozilla/5.0",
      "accept": "*/*"
    }
  });

  const headers = new Headers(resp.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "*");
  headers.set("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");

  return new Response(resp.body, {
    status: resp.status,
    headers
  });
}
