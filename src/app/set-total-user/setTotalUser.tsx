'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';
import { useForm } from 'react-hook-form';
import Input from '../_component/Input';
import Button from '../_component/Button';
import ErrorMessage from '../_component/ErrorMessage';
import { useRulesContext } from '../_context/RulesProviper';
import '@/app/style/page/set-total-user.scss';
import { useRouter } from 'next/navigation';

type Props = {
  email: string;
};

type FormValues = {
  password: string;
  emailToken: string;
};

export default function SetTotalUser({ email }: Props) {
  const [showVerify, setShowVerify] = useState(false);
  const { emailTokenRules, passwordRules } = useRulesContext();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
      emailToken: '',
    },
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await customFetch.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/change-total-user`,
        {
          body: {
            password: data.password,
            verificationToken: data.emailToken,
          },
        },
      );
      return res;
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const emailVerifyMute = useMutation({
    mutationFn: async () => {
      const res = await customFetch.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/verify-total-email`,
      );
      return res;
    },
    onSuccess: () => {
      setShowVerify(true);
    },
  });

  const emailTokenVerifyMute = useMutation({
    mutationFn: async (data: any) => {
      const res = await customFetch.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/verify-total-user`,
        {
          body: { verificationToken: data.emailToken },
        },
      );
      return res;
    },
  });

  const verifySendEmail = () => {
    if (email && !emailVerifyMute.isPending) emailVerifyMute.mutate();
  };

  const verityEmailToken = () => {
    const data = getValues();
    if (data.emailToken && !emailTokenVerifyMute.isPending) {
      emailTokenVerifyMute.mutate({
        emailToken: data.emailToken,
      });
    }
  };

  const submitForm = (data: FormValues) => {
    const password = data.password;
    const emailToken = data.emailToken;

    if (!mutation.isPending) {
      mutation.mutate({
        password: password,
        emailToken: emailToken,
      });
    }
  };

  return (
    <div className="form_inputContainer set_total_user">
      <form className="form_inputWrap" onSubmit={handleSubmit(submitForm)}>
        <Input label="이메일" name="email" disabled={true} value={email} />
        {!showVerify ? (
          <>
            <Button onClick={verifySendEmail} loading={emailVerifyMute.isPending}>
              이메일 인증하기
            </Button>
            {emailVerifyMute.isError ? (
              <ErrorMessage>{emailVerifyMute.error?.message}</ErrorMessage>
            ) : null}
          </>
        ) : (
          <>
            {!emailTokenVerifyMute.isSuccess && (
              <Input
                label="이메일 인증번호"
                name="emailToken"
                control={control}
                rules={emailTokenRules}
                error={errors.emailToken?.message}
              />
            )}

            <Button onClick={verityEmailToken} disabled={emailTokenVerifyMute.isSuccess}>
              {emailTokenVerifyMute.isSuccess ? '이메일 인증완료' : '이메일 인증하기'}
            </Button>
            {emailTokenVerifyMute.isError ? (
              <ErrorMessage>{emailTokenVerifyMute.error?.message}</ErrorMessage>
            ) : null}
          </>
        )}

        <Input
          type="password"
          label="비밀번호"
          name="password"
          showPassword={true}
          placeholder="password"
          control={control}
          rules={passwordRules}
          error={errors.password?.message}
        />

        <Button type="submit">통합회원 가입</Button>
        {mutation.error ? <ErrorMessage>{mutation.error.message}</ErrorMessage> : null}
      </form>
    </div>
  );
}
