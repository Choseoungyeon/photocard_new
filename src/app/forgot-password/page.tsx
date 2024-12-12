'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import customFetch from '@/app/_hook/customFetch';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import ErrorMessage from '../_component/ErrorMessage';
import { FiCheckCircle } from 'react-icons/fi';
import '@/app/style/page/forgot-password.scss';

type FormValues = {
  email: string;
};

function ForgotPasswordForm() {
  const { emailRules } = useRulesContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const forgotPasswordEmail = async (email: string) => {
    const res = await customFetch.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/forgot-password`,
      { body: { email } },
    );
    return res;
  };

  const mutation = useMutation({
    mutationFn: forgotPasswordEmail,
  });

  const onSubmit = async (data: { email: string }) => {
    if (!mutation.isPending) mutation.mutate(data.email);
  };

  return (
    <div className="form_inputContainer forgot_password">
      {mutation.isSuccess ? (
        <p className="success_typing">
          <FiCheckCircle />
          본인 확인용 이메일이 전송되었습니다. <br />
          <span>이메일을 확인해주세요.</span>
        </p>
      ) : (
        <form className="form_inputWrap" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            control={control}
            rules={emailRules}
            label="Email"
            name="email"
            error={errors.email?.message}
            onChange={() => {
              if (mutation.isError) mutation.reset();
            }}
            placeholder="johndoe@gmail.com"
          />

          <Button type="submit" loading={mutation.isPending}>
            비밀번호 변경
          </Button>
          {mutation.isError && <ErrorMessage>{mutation.error.message}</ErrorMessage>}
        </form>
      )}
    </div>
  );
}

export default ForgotPasswordForm;
