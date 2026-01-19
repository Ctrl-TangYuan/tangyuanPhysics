export default async function Home() {
  const res = await fetch("http://localhost:3000/api/health", { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: 40 }}>
      <h1>Tangyuan 🍡</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
