"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const pointerInsideRef = useRef(false);

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpenId(null);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setOpenId(null);
        setMobileOpen(false);
      }
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
      const names = arr.slice(0, previewLimit).map((p) => ({
        id: p.id,
        name: p.title,
      }));
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


  const toggleMobileItem = (id) => {
    if (openId === id) setOpenId(null);
    else {
      setOpenId(id);
      const cat = CATEGORIES.find((c) => c.id === id);
      loadCategory(cat);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex justify-center mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          {CATEGORIES.map((cat) => {
            const isOpen = openId === cat.id;
            const preview = data[cat.id];
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

                <div
                  id={`cat-panel-${cat.id}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-md shadow-lg transition-opacity duration-150
                    ${
                      isOpen
                        ? "opacity-100 visible pointer-events-auto z-50"
                        : "opacity-0 invisible pointer-events-none"
                    }
                    w-72 md:w-96`}
                >
                  <div className="p-3">
                    {loading === cat.id && (
                      <div className="py-3 text-sm text-gray-500">Loading…</div>
                    )}
                    {error === cat.id && (
                      <div className="py-3 text-sm text-red-600">
                        Failed to load
                      </div>
                    )}

                    {/* product list*/}
                    {preview && preview.length > 0 && (
                      <div className="grid grid-cols-1 gap-1 max-h-60 overflow-auto">
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

      {/* Mobile */}
      <div className="md:hidden px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Browse categories</div>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setMobileOpen((s) => !s);
              if (!mobileOpen) setOpenId(null);
            }}
            className="p-2 rounded-md border bg-white"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        
        <div
          className={`mt-3 transform transition-all duration-200 overflow-hidden ${
            mobileOpen ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border rounded-md shadow-sm">
            {CATEGORIES.map((cat) => {
              const preview = data[cat.id];
              const isExpanded = openId === cat.id;
              return (
                <div key={cat.id} className="border-b last:border-b-0">
                  <button
                    onClick={() => toggleMobileItem(cat.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                    aria-expanded={isExpanded}
                    aria-controls={`mobile-panel-${cat.id}`}
                  >
                    <span className="font-medium">{cat.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    id={`mobile-panel-${cat.id}`}
                    className={`px-2 pb-3 transition-all duration-200 ${
                      isExpanded ? "max-h-96" : "max-h-0 overflow-hidden"
                    }`}
                  >
                    {loading === cat.id && (
                      <div className="py-2 text-sm text-gray-500">Loading…</div>
                    )}
                    {error === cat.id && (
                      <div className="py-2 text-sm text-red-600">
                        Failed to load
                      </div>
                    )}

                    {preview && preview.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {preview.map((it) => (
                          <Link
                            key={it.id}
                            href={`/products/${it.id}`}
                            className="block px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-800"
                          >
                            {it.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {preview && preview.length === 0 && (
                      <div className="py-2 text-sm text-gray-600">No items</div>
                    )}

                    <div className="mt-2 px-3">
                      <Link
                        href={cat.href}
                        className="block w-full text-center px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium"
                      >
                        {cat.id === "all"
                          ? "View All Products"
                          : `View All ${cat.label}`}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
