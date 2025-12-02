"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "../providers/CartProvider";
import QuantityControl from "../components/QuantityControl";
import Link from "next/link";

export default function CartPage() {
  const { items = [], deleteFromCart } = useCart();

  if (!items || items.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-600 px-4">
        <ShoppingCart className="w-14 h-14 mb-4 opacity-40" />
        <h3 className="text-xl font-semibold mb-2">Your cart is empty.</h3>
        <p className="text-sm mb-6 max-w-md text-center">
          Looks like you haven't added anything to your cart yet. Browse
          products and add items you like.
        </p>
        <Link
          href="/products"
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, it) => {
    const price = Number(it.product?.price || 0);
    const qty = Number(it.quantity || 0);
    return sum + price * qty;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex gap-4 items-center border rounded p-4"
          >
            <img
              src={i.product?.images[0]}
              alt={i.product?.title}
              className="w-24 h-24 object-contain"
            />

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{i.product?.title}</div>
              <div className="mt-1 text-sm text-gray-600">
                ${Number(i.product?.price).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <QuantityControl item={i} />

              <div className="w-28 text-right font-semibold">
                $
                {(
                  Number(i.product?.price || 0) * Number(i.quantity || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-semibold">${subtotal.toFixed(2)}</div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/products"
            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>

          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
