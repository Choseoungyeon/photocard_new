'use client';
import { useState } from 'react';
import { useActionState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Input from '../_component/Input';
import Button from '../_component/Button';
import '@/app/style/page/login.scss';

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
    <div className="login_inputContainer">
      <div className="login_inputWrap">
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
            <Button className="crendential_login_btn" type="submit">
              {isPending ? 'is Pending...' : 'Login Now'}
            </Button>
          </div>
        </form>
        <Link href={'/nextAuth/forgot-password'}>비밀번호를 잃어버리셨나요?</Link>
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
