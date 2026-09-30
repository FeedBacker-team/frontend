import { postAuth } from './request';

const VERIFY_EMAIL_PATH = '/api/auth/email/verify';

type VerifyEmailCodeRequest = {
  email: string;
  code: string;
};

type VerifyEmailCodeResponse = {
  verified: boolean;
  message: string;
};

async function verifyEmailCode(
  body: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      verified: true,
      message: '이메일 인증이 완료되었습니다.',
    };
  }

  return postAuth<VerifyEmailCodeResponse>(VERIFY_EMAIL_PATH, {
    body,
    fallbackMessage: '이메일 인증이 완료되지 않았습니다',
  });
}

export { verifyEmailCode };
export type { VerifyEmailCodeRequest, VerifyEmailCodeResponse };
