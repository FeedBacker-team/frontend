import { UserError } from './error';
import { userRequest } from './request';

const CHECK_NICKNAME_PATH = '/api/users/check-nickname';

type CheckNicknameResponse = {
  is_available: boolean;
  message: string;
};

async function checkNickname(nickname: string): Promise<CheckNicknameResponse> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (nickname === 'taken') {
      throw new UserError('이미 사용 중인 닉네임입니다.', 409);
    }

    return {
      is_available: true,
      message: '사용 가능한 닉네임입니다.',
    };
  }

  const query = new URLSearchParams({ nickname });
  const data = await userRequest<CheckNicknameResponse>(
    `${CHECK_NICKNAME_PATH}?${query}`,
    {
      method: 'GET',
      fallbackMessage: (status) =>
        status === 409
          ? '이미 사용 중인 닉네임입니다.'
          : '닉네임 중복 확인에 실패했습니다',
    }
  );

  if (!data.is_available) {
    throw new UserError(
      data.message || '이미 사용 중인 닉네임입니다.',
      409
    );
  }

  return data;
}

export { checkNickname };
export type { CheckNicknameResponse };
