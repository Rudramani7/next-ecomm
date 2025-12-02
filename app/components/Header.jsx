"use client";

import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import { Heart, ShoppingCart } from "lucide-react";
import SearchComponent from "./SearchComponent";

export default function Header() {
  const { itemsCount } = useCart();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          arizon
        </Link>

        {/* Search */}
        <div className="flex-1 px-6 hidden sm:block">
          <SearchComponent />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <Heart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
            <span
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white
              text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-hover:translate-y-1
              transition-all pointer-events-none whitespace-nowrap"
            >
              Favorite
            </span>
          </div>

          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black transition" />
            {itemsCount > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs
              w-5 h-5 flex items-center justify-center rounded-full"
              >
                {itemsCount}
              </span>
            )}

            <span
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white
              text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-hover:translate-y-1
              transition-all pointer-events-none whitespace-nowrap"
            >
              Cart
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
