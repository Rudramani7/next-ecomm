// app/api/products/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://dummyjson.com/products', { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'Upstream error' }, { status: 502 });
    }
    const data = await res.json();
    // forward the products array
    return NextResponse.json({ ok: true, products: data.products ?? data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
