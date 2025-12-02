"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const API_BASE = "https://fakestoreapi.com";

const CATEGORIES = [
  { id: "all", label: "All", api: "/products", href: "/products" },
  {
    id: "electronics",
    label: "Electronics",
    api: "/products/category/electronics",
    href: "/products?category=electronics",
  },
  {
    id: "jewelery",
    label: "Jewelery",
    api: "/products/category/jewelery",
    href: "/products?category=jewelery",
  },
  {
    id: "men",
    label: "Men's Clothing",
    api: `/products/category/${encodeURIComponent("men's clothing")}`,
    href: `/products?category=${encodeURIComponent("men's clothing")}`,
  },
  {
    id: "women",
    label: "Women's Clothing",
    api: `/products/category/${encodeURIComponent("women's clothing")}`,
    href: `/products?category=${encodeURIComponent("women's clothing")}`,
  },
];

export default function MegaMenu({ previewLimit = 8 }) {
  const [openId, setOpenId] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const pointerInsideRef = useRef(false);

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpenId(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const loadCategory = async (cat) => {
    if (!cat || data[cat.id] || loading === cat.id) return;
    setLoading(cat.id);
    setError(null);
    try {
      const res = await fetch(API_BASE + cat.api);
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      const arr = Array.isArray(json) ? json : [json];
      const names = arr
        .slice(0, previewLimit)
        .map((p) => ({ id: p.id, name: p.title }));
      setData((s) => ({ ...s, [cat.id]: names }));
    } catch (e) {
      console.error("Category load error", e);
      setData((s) => ({ ...s, [cat.id]: [] }));
      setError(cat.id);
    } finally {
      setLoading(null);
    }
  };

  const handleMouseEnter = (id) => {
    pointerInsideRef.current = true;
    setOpenId(id);
    const cat = CATEGORIES.find((c) => c.id === id);
    loadCategory(cat);
  };

  const handleMouseLeave = () => {
    pointerInsideRef.current = false;
    setTimeout(() => {
      if (!pointerInsideRef.current) setOpenId(null);
    }, 120);
  };

  const toggle = (id) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
      const cat = CATEGORIES.find((c) => c.id === id);
      loadCategory(cat);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full flex justify-center mb-8">
      <div className="flex flex-wrap gap-3 items-center">
        {CATEGORIES.map((cat) => {
          const isOpen = openId === cat.id;
          const preview = data[cat.id];

          // show label
          const viewAllText =
            cat.id === "all" ? "View All Products" : `View All ${cat.label}`;

          return (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(cat.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggle(cat.id)}
                aria-expanded={isOpen}
                aria-controls={`cat-panel-${cat.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                  ${
                    isOpen
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="truncate max-w-[8rem]">{cat.label}</span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown */}
              <div
                id={`cat-panel-${cat.id}`}
                role="region"
                aria-hidden={!isOpen}
                className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border rounded-md shadow-lg transition-opacity duration-150
                  ${
                    isOpen
                      ? "opacity-100 visible pointer-events-auto z-50"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
              >
                <div className="p-2">
                  {loading === cat.id && (
                    <div className="py-3 text-sm text-gray-500">Loading…</div>
                  )}
                  {error === cat.id && (
                    <div className="py-3 text-sm text-red-600">
                      Failed to load
                    </div>
                  )}

                  {/* product list */}
                  {preview && preview.length > 0 && (
                    <div className="max-h-60 overflow-auto">
                      {preview.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.id}`}
                          className="block px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-800"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* no items */}
                  {preview && preview.length === 0 && (
                    <div className="py-3 text-sm text-gray-600">No items</div>
                  )}

                  <div className="border-t my-2" />

                  <Link
                    href={cat.href}
                    className="block text-center px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium"
                  >
                    {viewAllText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
