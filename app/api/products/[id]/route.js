// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const upstream = `https://fakestoreapi.in/api/products/${encodeURIComponent(id)}`;
    const res = await fetch(upstream, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'Upstream error' }, { status: 502 });
    }
    const data = await res.json();
    // Mirror returns the product object directly
    return NextResponse.json({ ok: true, product: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
