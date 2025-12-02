import { fetchAllProducts } from "../../lib/api";
import ProductCard from "../components/ProductCard";

export default async function ProductsPage({ searchParams }) {
  const search = searchParams?.search || "";
  const category = searchParams?.category || null;

  const products = await fetchAllProducts({ cache: "no-store" });

  const filtered = products.filter((p) => {
    const matchesSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = category
      ? p.category.toLowerCase() === category.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">
        {search
          ? `Search results for "${search}"`
          : category
            ? `Category: ${category}`
            : "All Products"}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
