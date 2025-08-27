'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import Link from 'next/link';
import Input from '../_component/Input';
import Button from '../_component/Button';
import ErrorMessage from '../_component/ErrorMessage';
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
      window.location.href = '/';
    },
  });

  const testLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await signIn('credentials', {
        email: 'test01@test.com',
        password: '111111',
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
      window.location.href = '/';
    },
  });

  const submitForm = async (data: FormValues) => {
    if (!mutation.isPending) mutation.mutate(data);
  };

  const handleTestLogin = () => {
    if (!testLoginMutation.isPending) testLoginMutation.mutate();
  };

  const resetFun = () => {
    if (mutation.isError) mutation.reset();
    if (testLoginMutation.isError) testLoginMutation.reset();
  };

  return (
    <div className="login_inputContainer">
      <div className="login_inputWrap">
        <form onSubmit={handleSubmit(submitForm)}>
          <div>
            <div>
              <Input
                control={control}
                rules={emailRules}
                error={errors.email?.message}
                label="email"
                name="email"
                placeholder="test01@gmail.com"
                onChange={resetFun}
              />
            </div>
            <div>
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
            </div>
            <Button className="crendential_login_btn" type="submit" loading={mutation.isPending}>
              로그인
            </Button>
            {mutation.isError ? <ErrorMessage>{mutation.error.message}</ErrorMessage> : null}
            {testLoginMutation.isError ? (
              <ErrorMessage>{testLoginMutation.error.message}</ErrorMessage>
            ) : null}
          </div>
        </form>

        <Link href={'/forgot-password'}>비밀번호를 잃어버리셨나요?</Link>
        {/* <div className="login_socail_btn">
          <Button className="naver_logn_btn" backgroundColor="transparent" onClick={naverLogin}>
            <Image src="/naver_login_btn.png" width={40} height={40} alt="login_btn" unoptimized />
          </Button>
          <Button className="naver_logn_btn" backgroundColor="transparent" onClick={naverLogin}>
            <Image src="/google_login_btn.png" width={40} height={40} alt="login_btn" unoptimized />
          </Button>
        </div> */}

        <div className="login_test_section">
          <div className="login_test_divider">
            <span>또는</span>
          </div>
          <Button
            className="test_login_btn"
            variant="secondary"
            onClick={handleTestLogin}
            loading={testLoginMutation.isPending}
          >
            테스트 계정으로 로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
