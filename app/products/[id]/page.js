import { fetchProductById } from '../../../lib/api';
import AddToCartButton from '../../components/AddToCartButton';

export default async function ProductPage({ params }) {
  const product = await fetchProductById(params.id, { cache: 'no-store' });

  if (!product) return <div>Product not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex items-center justify-center">
        <img src={product.image} alt={product.title} className="max-h-96 object-contain" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="mt-4">{product.description}</p>
        <p className="mt-4 text-xl font-bold">${product.price}</p>

        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
