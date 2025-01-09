'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import Link from 'next/link';
import Image from 'next/image';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import ErrorMessage from '@/app/_component/ErrorMessage';
import '@/app/style/page/login.scss';

type FormValues = {
  email: string;
  password: string;
};

export default function NextAuth() {
  const router = useRouter();
  const { emailRules, passwordRules } = useRulesContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        let errorMessage = response?.code;
        if (response?.code == null) {
          errorMessage = '잘못된 접근입니다. 잠시 후 다시한번 시도해주세요';
        }
        throw new Error(errorMessage);
      }

      return response;
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const submitForm = async (data: FormValues) => {
    if (!mutation.isPending) mutation.mutate(data);
  };

  const naverLogin = async () => {
    await signIn('naver', { redirect: true, callbackUrl: '/' });
  };

  const resetFun = () => {
    if (mutation.isError) mutation.reset();
  };

  return (
    <div className="login_inputContainer">
      <div className="login_inputWrap">
        <form onSubmit={handleSubmit(submitForm)}>
          <Input
            control={control}
            rules={emailRules}
            error={errors.email?.message}
            label="email"
            name="email"
            placeholder="johndoe@gmail.com"
            onChange={resetFun}
          />
          <Input
            control={control}
            rules={passwordRules}
            error={errors.password?.message}
            showPassword={true}
            onChange={resetFun}
            label="password"
            name="password"
            placeholder="password"
          />
          <Button className="crendential_login_btn" type="submit" loading={mutation.isPending}>
            로그인
          </Button>
          {mutation.isError ? <ErrorMessage>{mutation.error.message}</ErrorMessage> : null}
        </form>
        <Link href={'/forgot-password'}>비밀번호를 잃어버리셨나요?</Link>
        <div className="login_socail_btn">
          <Button className="naver_logn_btn" backgroundColor="transparent" onClick={naverLogin}>
            <Image src="/naver_login_btn.png" width={40} height={40} alt="login_btn" unoptimized />
          </Button>
          <Button className="naver_logn_btn" backgroundColor="transparent" onClick={naverLogin}>
            <Image src="/google_login_btn.png" width={40} height={40} alt="login_btn" unoptimized />
          </Button>
        </div>
      </div>
    </div>
  );
}
