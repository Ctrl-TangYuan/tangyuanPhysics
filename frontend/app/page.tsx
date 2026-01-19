export default async function Home() {
  const res = await fetch("http://localhost:3000/api/health", { cache: "no-store" });
  const text = await res.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: "Not JSON returned", first200: text.slice(0, 200) };
  }

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Tangyuan 🍡</h1>
      <pre style={{ marginTop: 16, padding: 16, background: "#111", color: "#0f0" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
