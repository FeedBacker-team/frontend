import { postAuth } from './request';

const EMAIL_VERIFICATION_REQUEST_PATH =
  '/api/auth/email/verification-request';

type SendEmailCodeRequest = {
  email: string;
};

type SendEmailCodeResponse = {
  message: string;
  expires_in: number;
};

async function sendEmailVerification(
  body: SendEmailCodeRequest
): Promise<SendEmailCodeResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      message: '인증번호가 발송되었습니다.',
      expires_in: 180,
    };
  }

  return postAuth<SendEmailCodeResponse>(EMAIL_VERIFICATION_REQUEST_PATH, {
    body,
    fallbackMessage: '인증번호 발송에 실패했습니다',
  });
}

export { sendEmailVerification };
export type { SendEmailCodeRequest, SendEmailCodeResponse };
