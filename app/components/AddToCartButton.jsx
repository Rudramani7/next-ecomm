'use client';
import { useCart } from '../providers/CartProvider';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  );
}
