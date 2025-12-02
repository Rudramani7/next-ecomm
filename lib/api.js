// lib/api.js
const BASE_URL = 'https://dummyjson.com';

async function request(endpoint, options = {}) {
  const config = { cache: 'no-store', ...options };
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Fetch error ${response.status} ${response.statusText} - ${text.slice(0,200)}`);
    }
    return await response.json();
  } catch (err) {
    console.error('lib/api.request failed:', { url, message: err.message });
    throw err;
  }
}

export async function getAllProducts(options) {
  try {
    // DummyJSON returns { products: [...], total, skip, limit }
    const data = await request('/products', options);
    return data?.products ?? [];
  } catch (err) {
    console.warn('getAllProducts failed:', err.message);
    return [];
  }
}

export async function getProductsByCategory(category, options) {
  if (!category || category === 'all') return getAllProducts(options);
  try {
    // DummyJSON category endpoint: /products/category/{category}
    const encoded = encodeURIComponent(category);
    const data = await request(`/products/category/${encoded}`, options);
    return data?.products ?? [];
  } catch (err) {
    console.warn('getProductsByCategory failed:', err.message);
  }
  const all = await getAllProducts(options);
  return all.filter(p => (p.category || '').toLowerCase().includes(category.toLowerCase()));
}

export async function getProduct(id, options) {
  if (!id) return null;
  try {
    // DummyJSON product endpoint: /products/{id}
    const data = await request(`/products/${id}`, options);
    // DummyJSON returns the product object directly
    return data ?? null;
  } catch (err) {
    console.warn('getProduct failed:', err.message);
    return null;
  }
}

export const fetchAllProducts = getAllProducts;
export const fetchProductsByCategory = getProductsByCategory;
export const fetchProductById = getProduct;
