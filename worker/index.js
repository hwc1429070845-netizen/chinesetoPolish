const SITE_ORIGIN = "https://hwc1429070845-netizen.github.io";
const GOOGLE_TTS = "https://translate.google.com/translate_tts";

function cors(origin) {
  if (origin !== SITE_ORIGIN) return {};
  return {
    "Access-Control-Allow-Origin": SITE_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function response(body, status, origin, extra = {}) {
  return new Response(body, {
    status,
    headers: {
      ...cors(origin),
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== SITE_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== "GET" || url.pathname !== "/tts") {
      return response("Not found", 404, origin, { "Content-Type": "text/plain; charset=utf-8" });
    }
    if (origin !== SITE_ORIGIN) {
      return response("Origin not allowed", 403, origin, { "Content-Type": "text/plain; charset=utf-8" });
    }

    const text = (url.searchParams.get("text") || "").trim();
    if (!text || [...text].length > 200) {
      return response("Text must contain 1–200 characters", 400, origin, { "Content-Type": "text/plain; charset=utf-8" });
    }

    const upstream = new URL(GOOGLE_TTS);
    upstream.searchParams.set("ie", "UTF-8");
    upstream.searchParams.set("client", "gtx");
    upstream.searchParams.set("tl", "pl");
    upstream.searchParams.set("q", text);

    try {
      const audio = await fetch(upstream, {
        headers: {
          "Accept": "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
          "Referer": "https://translate.google.com/",
          "User-Agent": "Mozilla/5.0",
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!audio.ok) {
        return response("Google TTS request failed", 502, origin, { "Content-Type": "text/plain; charset=utf-8" });
      }
      return response(audio.body, 200, origin, {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      });
    } catch {
      return response("Google TTS is unreachable", 502, origin, { "Content-Type": "text/plain; charset=utf-8" });
    }
  },
};
