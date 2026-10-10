import type { Metadata } from 'next';

import {
  IS_PRODUCTION_DEPLOYMENT,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/constants/metadata';
import { markdownToPlainText } from '@/lib/markdown/plainText';

const SITE_NAME = 'Feedbacker';
const DESCRIPTION_MAX_LENGTH = 160;

type DetailMetadataOptions = {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  shouldIndex?: boolean;
};

function createRobotsMetadata(shouldIndex = true): Metadata['robots'] {
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return {
      index: false,
      follow: false,
    };
  }

  return {
    index: shouldIndex,
    follow: true,
  };
}

function truncateText(value: string, maxLength: number) {
  const characters = Array.from(value);

  if (characters.length <= maxLength) {
    return value;
  }

  return `${characters.slice(0, maxLength - 1).join('')}…`;
}

function createMetadataDescription(value: string) {
  const plainText = markdownToPlainText(value);

  return plainText
    ? truncateText(plainText, DESCRIPTION_MAX_LENGTH)
    : SITE_DESCRIPTION;
}

function createDetailMetadata({
  title,
  description,
  path,
  imageUrl,
  shouldIndex = true,
}: DetailMetadataOptions): Metadata {
  const normalizedDescription = createMetadataDescription(description);
  const socialTitle = `${title} | ${SITE_NAME}`;
  const resolvedImage = imageUrl || OG_IMAGE_URL;
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title,
    description: normalizedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: createRobotsMetadata(shouldIndex),
    openGraph: {
      title: socialTitle,
      description: normalizedDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ko_KR',
      images: [
        {
          url: resolvedImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: normalizedDescription,
      images: [resolvedImage],
    },
  };
}

function createMissingContentMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export {
  createDetailMetadata,
  createMetadataDescription,
  createMissingContentMetadata,
  createRobotsMetadata,
};
