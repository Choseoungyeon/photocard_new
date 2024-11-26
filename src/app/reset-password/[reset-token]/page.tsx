'use client';
import React, { useState } from 'react';
import customFetch from '@/app/_hook/customFetch';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const resetPassword = async (token: string, password: string) => {
    await customFetch.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reset-password/${token}`, {
      body: JSON.stringify({
        password: password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    router.push('/nextAuth/login');
  };

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // handle submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = params['reset-token'] as string;
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match!');
    }
    if (token) resetPassword(token, password);
  };

  return (
    <main>
      <form>
        <div>
          <h1>Reset Your Password!</h1>
          <div>
            <label htmlFor="email">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              id="password"
              name="password"
              placeholder="*********"
            />
            <button onClick={togglePassword} type="button">
              {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
          </div>
          <div>
            <label htmlFor="email">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              id="password_confirm"
              name="password_confirm"
              placeholder="*********"
            />
            <button onClick={togglePassword} type="button">
              {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
          </div>
          <div className="flex">
            <button type="submit" onClick={handleSubmit}>
              Reset Password
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
