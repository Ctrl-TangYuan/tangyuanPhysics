import { headers } from "next/headers";

function getBaseUrl() {
  // On Vercel: build absolute URL from request headers
  if (process.env.VERCEL) return "VERCEL_FROM_HEADERS";

  // On Codespaces / local dev: call the server directly
  return "http://127.0.0.1:3000";
}

export default async function Home() {
  const baseMode = getBaseUrl();

  let base = baseMode;

  if (baseMode === "VERCEL_FROM_HEADERS") {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    base = host ? `${proto}://${host}` : "";
  }

  const res = await fetch(`${base}/api/health`, { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Tangyuan 🍡</h1>
      <p>Environment: {process.env.VERCEL ? "Vercel" : "Codespaces/Local"}</p>
      <pre style={{ marginTop: 16, padding: 16, background: "#111", color: "#0f0" }}>
        {JSON.stringify({ base, ...data }, null, 2)}
      </pre>
    </main>
  );
}
