import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.chouhanmattress.com';

  // Static routes
  const staticRoutes = [
    '',
    '/products',
    '/cart',
    '/checkout',
    '/account',
    '/wishlist',
    '/mattress-selector',
    '/compare',
    '/reviews',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = productsData.map((p) => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic category routes
  const categoryRoutes = ['mattresses', 'sofas', 'beds', 'pillows', 'accessories'].map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
