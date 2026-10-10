import type { MetadataRoute } from 'next';

import {
  IS_PRODUCTION_DEPLOYMENT,
  SITE_URL,
} from '@/constants/metadata';

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/oauth/',
        '/profile',
        '/mypage',
        '/projects/new',
        '/projects/*/edit',
        '/qa/new',
        '/qa/*/feedback',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
