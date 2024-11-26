'use client';
import { useState } from 'react';
import { registerUser } from '@/app/_hook/fetch';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VerifyModule from './_component/VerifyModule';

export default function NextAuth() {
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePassword = () => setShowPassword(!showPassword);

  const submitForm = (formData: FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const emailToken = formData.get('emailToken') as string;

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
    <form action={submitForm}>
      <div>
        <div>
          <label htmlFor="name">name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="JK"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="johndoe@gmail.com"
          />
        </div>
        <VerifyModule
          formData={formData}
          onChange={(e) => setFormData({ ...formData, emailToken: e.target.value })}
        />
        <div>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="***************"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="button">
            {showPassword ? (
              <i className="fas fa-eye-slash" onClick={togglePassword}></i>
            ) : (
              <i className="fas fa-eye" onClick={togglePassword}></i>
            )}
          </button>
        </div>

        <div className="flex">
          <button type="submit">{'Login Now'}</button>
          {mutation.error ? <p style={{ color: 'red' }}>{mutation.error.message}</p> : null}
        </div>
      </div>
    </form>
  );
}
