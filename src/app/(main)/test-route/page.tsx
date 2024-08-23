import { useCallback } from 'react';
import { auth } from '@/auth';
import WhoAmIServerAction from './WhoAmIServerAction';
import WhoAmIAPI from './WhoAmIAPI';
import WhoAmIRSC from './WhoAmIRSC';

export default async function TestRoute() {
  const session = await auth();

  const onGetUserAction = useCallback(async () => {
    'use server';

    const sessionData = await auth();
    return sessionData?.user?.name ?? null;
  }, []);

  return (
    <main>
      <h1 className="text-3xl mb-5">Test Route</h1>
      <div>User: {session?.user?.name}</div>
      <WhoAmIServerAction onGetUserAction={onGetUserAction} />
      <WhoAmIAPI />
      <WhoAmIRSC />
    </main>
  );
}
