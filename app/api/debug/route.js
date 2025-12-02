import { NextResponse } from 'next/server';
import { getAllProducts } from '../../../lib/api';

export async function GET() {
  try {
    const products = await getAllProducts({ cache: 'no-store' });
    return NextResponse.json({
      ok: true,
      count: Array.isArray(products) ? products.length : 0,
      sample: (products || []).slice(0, 5),
    });
  } catch (err) {
    console.error('api debug error', err);
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
