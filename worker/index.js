import { handleApi } from "./api.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApi({ request, env });
    }
    if (!env.ASSETS) {
      return new Response("Static asset binding ASSETS is not configured", {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
