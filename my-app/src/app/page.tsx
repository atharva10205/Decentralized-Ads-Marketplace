import Ad from "./components/Ad";

const posts = [
  { id: "p1", title: "How to learn JS in 2025", body: "Short content..." },
  { id: "p2", title: "Understanding WebRTC", body: "Short content..." },
  { id: "p3", title: "Solana vs Ethereum: Quick dive", body: "Short content..." }
];

export default function Page() {
  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>Demo Blog</h1>
      <p style={{ color: "#666" }}>
        Ads below are monitored and will console.log server-signed receipts.
      </p>

      {posts.map((p) => (
        <article key={p.id} style={{ marginBottom: 40 }}>
          <h2>{p.title}</h2>
          <p>{p.body}</p>

          {/* Place Ad */}
          <Ad adId={`ad-${p.id}`} />
        </article>
      ))}

      <h3>Footer Ad</h3>
      <Ad adId="ad-footer" />
    </main>
  );
}
