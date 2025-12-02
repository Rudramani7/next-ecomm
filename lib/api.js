const BASE_URL = 'https://fakestoreapi.com';

async function request(endpoint, options = {}) {
  const config = {
    cache: 'no-store',
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getAllProducts(options) {
  try {
    return await request('/products', options);
  } catch (err) {
    console.warn('Failed to load products:', err.message);
    return [];
  }
}

export async function getProductsByCategory(category, options) {
  if (!category || category === 'all') {
    return getAllProducts(options);
  }

  try {
    const encoded = encodeURIComponent(category);
    const products = await request(`/products/category/${encoded}`, options);

    if (Array.isArray(products) && products.length > 0) {
      return products;
    }
  } catch (err) {
    console.warn(`Category fetch failed (${category}):`, err.message);
  }

  const all = await getAllProducts(options);

  return all.filter((item) =>
    (item.category || '').toLowerCase().includes(category.toLowerCase())
  );
}

export async function getProduct(id, options) {
  if (!id) return null;

  try {
    return await request(`/products/${id}`, options);
  } catch (err) {
    console.warn(`Failed to load product ${id}:`, err.message);
    return null;
  }
}


export const fetchAllProducts = getAllProducts;
export const fetchProductsByCategory = getProductsByCategory;
export const fetchProductById = getProduct;
