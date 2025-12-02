"use client";
import Link from "next/link";
import { useCart } from "../providers/CartProvider";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded p-4 flex flex-col">
      <Link href={`/products/${product.id}`} className="flex-1 group">
        <div className="h-48 flex items-center justify-center mb-4">
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-40 object-contain"
          />
        </div>

        <h3 className="text-sm font-medium transition group-hover:text-blue-600">
          {product.title}
        </h3>

        <p className="mt-2 font-semibold">${product.price}</p>
      </Link>

      <button
        onClick={() => addToCart(product)}
        className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
