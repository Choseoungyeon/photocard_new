'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import customFetch from '@/app/_hook/customFetch';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';

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
    mutation.mutate(data.email);
  };

  return (
    <div className="form_inputContainer">
      <form className="form_inputWrap" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          control={control}
          rules={emailRules}
          label="Email"
          name="email"
          error={errors.email?.message || mutation.error?.message}
          onChange={() => {
            if (mutation.isError) mutation.reset();
          }}
          placeholder="johndoe@gmail.com"
        />

        <Button type="submit" loading={mutation.isPending}>
          비밀번호 변경
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
