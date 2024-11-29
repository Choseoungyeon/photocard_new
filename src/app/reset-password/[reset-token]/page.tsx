'use client';
import React, { useState } from 'react';
import customFetch from '@/app/_hook/customFetch';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const resetPassword = async (token: string, password: string) => {
    await customFetch.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reset-password/${token}`, {
      body: { password: password },
    });
    router.push('/nextAuth/login');
  };

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = params['reset-token'] as string;
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match!');
    }
    if (token) resetPassword(token, password);
  };

  return (
    <div className="form_inputContainer">
      <form className="form_inputWrap">
        <Input
          type="password"
          showPassword={true}
          value={password}
          onChange={handlePasswordChange}
          label="새 비밀번호"
          name="password"
          placeholder="password"
        />
        <Input
          type="password"
          showPassword={true}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          label="비밀번호 확인"
          name="password_confirm"
          placeholder="password confirm"
        />
        <Button type="submit" onClick={() => handleSubmit}>
          비밀번호 리셋하기
        </Button>
      </form>
    </div>
  );
}
