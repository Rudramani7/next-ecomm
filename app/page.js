import ProductCard from "./components/ProductCard";
import { fetchAllProducts } from "../lib/api";
import MegaMenu from "./components/MegaMenu";

export default async function HomePage() {
  const products = await fetchAllProducts({ cache: "no-store" });

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-3">Welcome to NewComm Store</h1>
      <p className="text-gray-600 mb-10 max-w-xl mx-auto">
        Explore products across electronics, fashion, accessories, and more.
      </p>

      <MegaMenu />

      {/* products */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
