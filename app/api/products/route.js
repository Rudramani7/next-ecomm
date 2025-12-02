// app/api/products/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    // If category query present, call mirror category endpoint
    const upstream = category
      ? `https://fakestoreapi.in/api/products/category/${encodeURIComponent(category)}`
      : 'https://fakestoreapi.in/api/products';

    const res = await fetch(upstream, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'Upstream error' }, { status: 502 });
    }
    const data = await res.json();
    // The mirror returns an array for both /products and /products/category/...
    return NextResponse.json(Array.isArray(data) ? { ok: true, products: data } : { ok: true, products: data.products ?? data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
