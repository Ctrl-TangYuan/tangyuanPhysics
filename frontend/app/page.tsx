import { headers } from "next/headers";

export default async function Home() {
  const h = await headers();

  // On Vercel this is the real host, e.g. tangyuan-physics.vercel.app
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) {
    // Fallback (shouldn't happen on Vercel)
    return (
      <main style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1>Tangyuan 🍡</h1>
        <p>Host header missing.</p>
      </main>
    );
  }

  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/health`, { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Tangyuan 🍡</h1>
      <p>First evolution: deployed + API reachable.</p>
      <pre style={{ marginTop: 16, padding: 16, background: "#111", color: "#0f0" }}>
        {JSON.stringify({ base, ...data }, null, 2)}
      </pre>
    </main>
  );
}
