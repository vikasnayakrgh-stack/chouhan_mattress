import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.chouhanmattress.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/account', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
