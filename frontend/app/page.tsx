export default async function Home() {
  // Relative URL works both locally and on Vercel
  const res = await fetch("/api/health", { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Tangyuan 🍡</h1>
      <p>First evolution: deployed + API reachable.</p>
      <pre style={{ marginTop: 16, padding: 16, background: "#111", color: "#0f0" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
