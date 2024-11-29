'use client';
import React from 'react';
import { registerUser } from '@/app/_hook/fetch';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import VerifyModule from './_component/VerifyModule';
import { useRulesContext } from '@/app/_context/RulesProviper';
import Input from '../_component/Input';
import Button from '@/app/_component/Button';
import '@/app/style/page/register.scss';

type FormValues = {
  email: string;
  password: string;
  name: string;
  emailToken: string;
};
type useFormType = UseFormReturn<FormValues, any, undefined> | undefined;
export const MyContext = React.createContext<useFormType>(undefined);

export default function NextAuth() {
  const router = useRouter();
  const { passwordRules } = useRulesContext();

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
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      emailToken: data.emailToken,
    });
  };

  return (
    <MyContext.Provider value={useFormReturn}>
      <div className="register_inputContainer">
        <div className="register_inputWrap">
          <form onSubmit={handleSubmit(submitForm)}>
            <Input name="name" label="name" placeholder="JK" control={control} />
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

            <div className="flex">
              <Button type="submit">회원가입하기</Button>
              {mutation.error ? <p style={{ color: 'red' }}>{mutation.error.message}</p> : null}
            </div>
          </form>
        </div>
      </div>
    </MyContext.Provider>
  );
}
