import { AddToCart } from '@/components/add-to-cart';
import { ShareShopLink } from '@/components/share-shop-link';
import { formatPKR } from '@/lib/money';
import { prisma } from '@/lib/prisma';
import { categories as catalogCategories, items as catalogItems } from '@/prisma/seed';

const mobileUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://192.168.110.40:3000';

type ShopParams = { q?: string; category?: string; sort?: string };

function getFallbackCatalog({ q, category, sort }: ShopParams) {
  const query = q?.trim().toLowerCase();
  const categoryName = catalogCategories.find(([name]) => name.toLowerCase() === category?.toLowerCase())?.[0];

  const products = catalogItems
    .filter(([name, categorySlug]) => {
      const itemCategory = catalogCategories.find(([, slug]) => slug === categorySlug)?.[0];
      return (!query || name.toLowerCase().includes(query)) && (!categoryName || itemCategory === categoryName);
    })
    .map(([name, categorySlug, price, salePrice, unit, imageUrl]) => {
      const productCategory = catalogCategories.find(([, slug]) => slug === categorySlug)?.[0] ?? 'Groceries';
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      return {
        id: `catalog-${slug}`,
        name,
        price: salePrice ?? price,
        unit,
        imageUrl,
        category: { name: productCategory },
      };
    });

  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  else products.sort((a, b) => a.name.localeCompare(b.name));

  return products;
}

export default async function Shop({ searchParams }: { searchParams: Promise<ShopParams> }) {
  const params = await searchParams;
  let products: any[] = [];
  let categories: { name: string; slug?: string }[] = catalogCategories.map(([name, slug]) => ({ name, slug }));

  try {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(params.q ? { name: { contains: params.q, mode: 'insensitive' as const } } : {}),
        ...(params.category ? { category: { name: params.category } } : {}),
      },
      include: { category: true },
      orderBy:
        params.sort === 'price-asc'
          ? { price: 'asc' }
          : params.sort === 'price-desc'
            ? { price: 'desc' }
            : { name: 'asc' },
    });

    const databaseCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    if (databaseCategories.length) categories = databaseCategories;
  } catch {
    // The local catalog below keeps shopping usable when PostgreSQL is unavailable.
  }

  if (!products.length) products = getFallbackCatalog(params);

  return (
    <div className="container section">
      <section
        className="card"
        style={{
          padding: 26,
          marginBottom: 22,
          background: 'linear-gradient(135deg,#edf9f0 0%,#ffffff 55%,#fff7e8 100%)',
          border: '1px solid #e7f1ea',
          boxShadow: '0 18px 35px rgba(17,44,33,0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span className="tag">Mustafa Dost FreshMart</span>
            <h1 style={{ fontSize: 38, margin: '12px 0 8px' }}>Shop groceries</h1>
            <p className="muted" style={{ maxWidth: 620, lineHeight: 1.7 }}>
              Fresh picks, trusted quality and everyday essentials for homes, families and busy routines. Browse our
              fruits, vegetables, pantry staples and more.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href={`${mobileUrl}/shop`} target="_blank" rel="noreferrer" className="btn btn-primary">
              Open on phone
            </a>
            <ShareShopLink />
          </div>
        </div>
      </section>

      <span className="tag">The FreshMart store</span>
      <h2 style={{ fontSize: 30, margin: '12px 0' }}>Find your groceries</h2>
      <p className="muted">Browse more than 20 items in every department.</p>

      <form
        action="/shop"
        method="get"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 2fr) minmax(150px, 1fr) minmax(140px, 1fr) auto', gap: 10, margin: '22px 0' }}
      >
        <input className="input" type="search" name="q" placeholder="Search products" defaultValue={params.q} />
        <select className="input" name="category" defaultValue={params.category ?? ''}>
          <option value="">All departments</option>
          {categories.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <select className="input" name="sort" defaultValue={params.sort ?? 'name'}>
          <option value="name">Sort: Name</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
        </select>
        <button className="btn btn-primary" type="submit">Find products</button>
      </form>

      {products.length === 0 ? (
        <div className="card" style={{ padding: 35, textAlign: 'center' }}>
          No products found. Try a different search or department.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 18 }}>
          {products.map((product) => (
            <article className="card" key={product.id} style={{ overflow: 'hidden' }}>
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                loading="lazy"
                style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: 16 }}>
                <span className="tag">{product.category.name}</span>
                <h3 style={{ fontSize: 16, margin: '10px 0 14px' }}>{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <b style={{ color: '#176b45' }}>
                    {formatPKR(product.salePrice ?? product.price)}{' '}
                    <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>/ {product.unit}</span>
                  </b>
                  <AddToCart product={product} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
