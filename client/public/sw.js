const BACKEND_ORIGIN = "https://betsports-backend.onrender.com";
const LEGACY_ORIGIN = "https://ddhstgijmoixtatdardt.supabase.co";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== LEGACY_ORIGIN) return;
  const target = new URL(url.pathname + url.search, BACKEND_ORIGIN);
  const headers = new Headers(event.request.headers);
  headers.delete("host");
  headers.set("x-betsports-proxy", "frontend-service-worker");
  event.respondWith(fetch(new Request(target.toString(), {
    method: event.request.method,
    headers,
    body: ["GET", "HEAD"].includes(event.request.method) ? undefined : event.request.clone().body,
    mode: "cors",
    credentials: "include",
    redirect: "follow",
  })));
});
