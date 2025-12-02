"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => {
    setQuery("");
    router.push("/");
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

      <input
        type="text"
        placeholder="Search products..."
        className="w-full border rounded-lg pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-blue-300"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);

          if (value.trim() === "") {
            router.push("/");
          }
        }}
      />

      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
}
