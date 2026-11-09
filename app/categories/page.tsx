import Link from 'next/link';
import { categories } from '@/prisma/seed';

const icons = ['🍎', '🥦', '🥛', '🍗', '🥖', '🥤', '🍿', '🌾', '🫒', '🌶️', '🧊', '🧽'];

export default function Categories() {
  return (
    <div className="container section">
      <span className="tag">Browse aisles</span>
      <h1 style={{ fontSize: 36 }}>All categories</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginTop: 25 }}>
        {categories.map(([name, slug], index) => (
          <Link
            className="card"
            href={`/shop?category=${encodeURIComponent(name)}`}
            key={slug}
            style={{ padding: 22, textAlign: 'center' }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>{icons[index]}</div>
            <b>{name}</b>
            <p className="muted" style={{ fontSize: 13 }}>20+ products</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
