'use client';

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { registerUser } from '@/app/_hook/fetch';
import { useRulesContext } from '@/app/_context/RulesProviper';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import ErrorMessage from '@/app/_component/ErrorMessage';
import { MyContext } from '@/app/_context/MyContext';
import VerifyModule from './_component/VerifyModule';

import '@/app/style/page/register.scss';

type FormValues = {
  email: string;
  password: string;
  name: string;
  emailToken: string;
};

export default function NextAuth() {
  const router = useRouter();
  const { passwordRules, nameRules } = useRulesContext();

  const useFormReturn = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      emailToken: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useFormReturn;

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      const data = getValues();
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response?.code);
      } else {
        router.push('/');
      }
    },
  });

  const submitForm = (data: FormValues) => {
    if (!mutation.isPending) {
      mutation.mutate({
        name: data.name,
        email: data.email,
        password: data.password,
        emailToken: data.emailToken,
      });
    }
  };

  return (
    <MyContext.Provider value={useFormReturn}>
      <div className="register_inputContainer">
        <div className="register_inputWrap">
          <form onSubmit={handleSubmit(submitForm)}>
            <Input
              name="name"
              label="name"
              placeholder="JK"
              control={control}
              rules={nameRules}
              error={errors.name?.message}
            />
            <VerifyModule />
            <Input
              name="password"
              label="password"
              showPassword={true}
              placeholder="password"
              control={control}
              error={errors.password?.message}
              rules={passwordRules}
            />

            <Button type="submit">회원가입하기</Button>
            {mutation.error ? <ErrorMessage>{mutation.error.message}</ErrorMessage> : null}
          </form>
        </div>
      </div>
    </MyContext.Provider>
  );
}
