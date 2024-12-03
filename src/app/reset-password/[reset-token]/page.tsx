'use client';
import React from 'react';
import customFetch from '@/app/_hook/customFetch';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import { useForm } from 'react-hook-form';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import ErrorMessage from '@/app/_component/ErrorMessage';

type Data = {
  token: string;
  password: string;
};

type FormValues = {
  password: string;
  passwordConfirm: string;
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { passwordRules } = useRulesContext();
  const [confirmPasswordError, setComfirmPasswordError] = React.useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    mode: 'onChange',
  });

  const resetPassword = async (data: Data) => {
    const res = await customFetch.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reset-password/${data.token}`,
      {
        body: { password: data.password },
      },
    );

    return res;
  };

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.push('/login');
    },
  });

  const submitForm = (data: FormValues) => {
    const token = params['reset-token'] as string;
    if (data.password !== data.passwordConfirm) {
      setComfirmPasswordError(true);
      return;
    }
    if (token && !mutation.isPending)
      mutation.mutate({
        token: token,
        password: data.password,
      });
  };

  return (
    <div className="form_inputContainer">
      <form className="form_inputWrap" onSubmit={handleSubmit(submitForm)}>
        <Input
          type="password"
          showPassword={true}
          control={control}
          rules={passwordRules}
          error={errors.password?.message}
          label="새 비밀번호"
          name="password"
          placeholder="password"
        />
        <Input
          type="password"
          showPassword={true}
          control={control}
          rules={passwordRules}
          error={
            confirmPasswordError ? '비밀번호가 일치하지 않습니다' : errors.passwordConfirm?.message
          }
          onChange={() => {
            setComfirmPasswordError(false);
          }}
          label="비밀번호 확인"
          name="passwordConfirm"
          placeholder="password confirm"
        />
        <Button type="submit">비밀번호 리셋하기</Button>
        {mutation.isError && <ErrorMessage>{mutation.error.message}</ErrorMessage>}
      </form>
    </div>
  );
}
