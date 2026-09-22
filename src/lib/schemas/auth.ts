import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().refine((value) => z.email().safeParse(value).success, {
    message: '올바른 이메일 형식을 입력해 주세요',
  }),
  password: z.string().min(1, '비밀번호를 입력해 주세요'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export { loginSchema };
export type { LoginFormValues };
