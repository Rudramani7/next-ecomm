import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const r = await fetch('https://fakestoreapi.com/products');
    if (!r.ok) return NextResponse.json({ ok: false, error: 'Upstream error' }, { status: 502 });
    const data = await r.json();
    return NextResponse.json({ ok: true, products: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err.message) }, { status: 500 });
  }
}
