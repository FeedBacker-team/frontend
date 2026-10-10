const SITE_URL = 'https://feedbacker.co.kr';
const SITE_TITLE = 'Feedbacker | 메이커들과 함께하는 QA 품앗이 플랫폼';
const SITE_DESCRIPTION =
  '프로젝트를 등록해 QA 참여자를 모집하고, 다른 메이커의 서비스를 테스트하며 피드백과 도토리를 주고받아 보세요.';
const OG_IMAGE_URL = '/og/feedbacker-og.png';
const IS_PRODUCTION_DEPLOYMENT = process.env.VERCEL_ENV === 'production';

export {
  IS_PRODUCTION_DEPLOYMENT,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
};
