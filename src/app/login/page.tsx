'use client';
import { useState } from 'react';
import { useActionState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../_component/Input';
import Button from '../_component/button';

export default function NextAuth() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();
  const [state, submitForm, isPending] = useActionState(async (prevState: any, queryData: any) => {
    const response = await signIn('credentials', {
      email: queryData.get('email'),
      password: queryData.get('password'),
      redirect: false,
    });

    if (response?.error) {
      throw new Error(response?.code);
    } else {
      router.push('/');
    }

    return queryData;
  }, formData);

  const naverLogin = async () => {
    await signIn('naver', { redirect: true, callbackUrl: '/' });
  };

  return (
    <>
      <form action={submitForm}>
        <div>
          <div>
            <Input
              label="email"
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="johndoe@gmail.com"
            />
          </div>
          <div>
            <Input
              label="password"
              showPassword={true}
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <Button type="submit">{isPending ? 'is Pending...' : 'Login Now'}</Button>
        </div>
      </form>
      <Button backgroundColor="#03C75A" onClick={naverLogin}>
        네이버 로그인
      </Button>
      <Link style={{ backgroundColor: 'black', color: 'white' }} href={'/nextAuth/forgot-password'}>
        비밀번호를 잃어버리셨나요? - 비밀번호 찾으러가기
      </Link>
    </>
  );
}
