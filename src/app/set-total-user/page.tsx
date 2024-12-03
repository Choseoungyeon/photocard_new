'use server';

import '@/app/style/page/set-total-user.scss';
import SetTotalUser from './setTotalUser';
import { auth } from '@/auth';

export default async function NextAuth() {
  const session = await auth();
  let userEmail = '';
  if (session?.user.email) userEmail = session?.user.email;
  return <SetTotalUser email={userEmail} />;
}
