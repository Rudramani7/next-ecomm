'use client';
import { useEffect } from 'react';

export default function FetchRedirector() {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      try {
        if (typeof args[0] === 'string') {
          // rewrite client calls that start with /products to /api/products
          if (args[0].startsWith('/products')) {
            args[0] = args[0].replace('/products', '/api/products');
          }
        } else if (args[0] && args[0].url && args[0].url.startsWith('/products')) {
          const newUrl = args[0].url.replace('/products', '/api/products');
          args[0] = new Request(newUrl, args[0]);
        }
        return originalFetch.apply(this, args);
      } catch (e) {
        return originalFetch.apply(this, args);
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  return null;
}
