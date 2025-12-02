import { NextResponse } from "next/server";

export async function GET() {
  try {
    const r = await fetch("https://fakestoreapi.com/products");
    const data = await r.json();
    return NextResponse.json({ ok: true, products: data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
