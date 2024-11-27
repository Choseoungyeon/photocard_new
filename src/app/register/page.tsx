'use client';
import { useState } from 'react';
import { registerUser } from '@/app/_hook/fetch';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VerifyModule from './_component/VerifyModule';
import Input from '../_component/Input';
import Button from '@/app/_component/Button';
import '@/app/style/page/register.scss';

export default function NextAuth() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', emailToken: '' });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      // 자동 로그인
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response?.code);
      } else {
        router.push('/');
      }
    },
  });

  const submitForm = () => {
    const name = formData.name;
    const email = formData.email as string;
    const password = formData.password as string;
    const emailToken = formData.emailToken as string;

    if (name && email && password && emailToken) {
      mutation.mutate({
        name: name,
        email: email,
        password: password,
        emailToken: emailToken,
      });
    }
  };

  return (
    <div className="register_inputContainer">
      <div className="register_inputWrap">
        <form action={submitForm}>
          <Input
            type="text"
            name="name"
            label="name"
            placeholder="JK"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            type="text"
            name="email"
            label="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="johndoe@gmail.com"
          />

          <VerifyModule
            formData={formData}
            onChange={(e) => setFormData({ ...formData, emailToken: e.target.value })}
          />

          <Input
            name="password"
            label="password"
            showPassword={true}
            placeholder="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="flex">
            <Button type="submit">{'Login Now'}</Button>
            {mutation.error ? <p style={{ color: 'red' }}>{mutation.error.message}</p> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
