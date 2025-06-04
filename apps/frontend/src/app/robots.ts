import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/ocr-debug/'],
    },
    sitemap: 'https://alpha-informatik.ch/sitemap.xml',
  }
}