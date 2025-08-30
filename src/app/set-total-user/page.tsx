'use server';

import { auth } from '@/auth';
import SetTotalUser from './setTotalUser';

import '@/app/style/page/set-total-user.scss';

export default async function NextAuth() {
  const session = await auth();
  let userEmail = '';
  if (session?.user.email) userEmail = session?.user.email;
  return <SetTotalUser email={userEmail} />;
}
