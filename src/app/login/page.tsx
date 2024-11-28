'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import Link from 'next/link';
import Image from 'next/image';
import Input from '../_component/Input';
import Error from '../_component/Error';
import Button from '../_component/Button';
import '@/app/style/page/login.scss';

type FormValues = {
  email: string;
  password: string;
};

export default function NextAuth() {
  const router = useRouter();

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

      return response;
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const submitForm = async (data: FormValues) => {
    mutation.mutate(data);
  };

  const naverLogin = async () => {
    await signIn('naver', { redirect: true, callbackUrl: '/' });
  };

  if (mutation.isError) return <Error />;

  return (
    <div className="login_inputContainer">
      <div className="login_inputWrap">
        <form onSubmit={handleSubmit(submitForm)}>
          <div>
            <div>
              <Input control={control} label="email" name="email" placeholder="johndoe@gmail.com" />
            </div>
            <div>
              <Input
                control={control}
                showPassword={true}
                label="password"
                name="password"
                placeholder="password"
              />
            </div>
            <Button className="crendential_login_btn" type="submit" loading={mutation.isPending}>
              로그인
            </Button>
          </div>
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
