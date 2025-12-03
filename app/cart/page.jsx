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
        {items.map((i) => {
          const price = Number(i.product?.price || 0);
          const qty = Number(i.quantity || 0);
          const lineTotal = (price * qty).toFixed(2);
          const title = i.product?.title || "Product";
          const imgSrc =
            i.product?.images?.[0] || i.product?.image || "/placeholder.png";

          return (
            <div
              key={i.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded p-4"
            >
              <div className="w-full sm:w-24 h-44 sm:h-24 flex items-center justify-center bg-white">
                <img
                  src={imgSrc}
                  alt={title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{title}</div>
                <div className="mt-1 text-sm text-gray-600">
                  ${price.toFixed(2)}
                </div>
              </div>

              <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none">
                  <QuantityControl item={i} />
                </div>

                <div className="w-full sm:w-28 text-left sm:text-right font-semibold tabular-nums">
                  ${lineTotal}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-8">
        <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4">

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto px-4 py-2 border rounded hover:bg-gray-50 transition text-center"
            >
              Continue Shopping
            </Link>

            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>

          <div className="flex-1 md:flex-none">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-semibold">${subtotal.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
