export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // mode query ?url=
  let target = url.searchParams.get("url");

  // fallback path-based
  if (!target) {
    const path = url.pathname.slice(1);
    if (path.startsWith("http://") || path.startsWith("https://")) {
      target = path;
    }
  }

  if (!target) {
    return new Response("Missing target url", { status: 400 });
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid target url", { status: 400 });
  }

  try {
    const resp = await fetch(targetUrl.toString(), {
      headers: {
        "accept": "*/*",
        "accept-encoding": "identity;q=1, *;q=0",
        "accept-language": "en-US,en;q=0.9",
        "priority": "i",
        "range": "bytes=0-",
        "referer": "https://cloud.hownetwork.xyz/",
        "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "video",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
        "sec-fetch-storage-access": "active",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
      }
    });

    // forward response apa adanya
    return new Response(resp.body, {
      status: resp.status,
      headers: resp.headers
    });
  } catch (err) {
    return new Response("Fetch error", { status: 502 });
  }
}
