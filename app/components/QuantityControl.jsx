"use client";
import { useCart } from "../providers/CartProvider";

export default function QuantityControl({ item }) {
  const { updateProduct, deleteFromCart } = useCart();

  return (
    <div className="flex items-center gap-2">
      <button
        className="px-2 py-1 border rounded"
        onClick={() => updateProduct(item.id, item.quantity - 1)}
      >
        −
      </button>
      <span>{item.quantity}</span>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => updateProduct(item.id, item.quantity + 1)}
      >
        +
      </button>
      <button
        className="ml-4 text-sm text-red-600"
        onClick={() => deleteFromCart(item.id)}
      >
        Delete
      </button>
    </div>
  );
}
