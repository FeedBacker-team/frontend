import { z } from 'zod';

const AUTH_PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const emailSchema = z.string().refine((value) => z.email().safeParse(value).success, {
  message: '올바른 이메일 형식을 입력해 주세요',
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해 주세요'),
});

const signupSchema = z
  .object({
    email: emailSchema,
    verificationCode: z.string(),
    password: z.string().refine(
      (value) => AUTH_PASSWORD_PATTERN.test(value),
      { message: '비밀번호를 입력해 주세요' }
    ),
    passwordConfirm: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema };
export type { LoginFormValues, SignupFormValues };
