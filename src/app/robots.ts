import type { MetadataRoute } from 'next';

import {
  IS_PRODUCTION_DEPLOYMENT,
  SITE_URL,
} from '@/constants/metadata';

// ChatGPT, Perplexity, Gemini, Claude 등 AI 답변 엔진이 쓰는 주요 크롤러.
// 전체 허용(userAgent: '*')과 별개로, AI 엔진 노출 의도를 명시적으로 드러내기 위해 나열한다.
const AI_CRAWLER_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
];

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
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
