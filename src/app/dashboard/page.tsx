'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) return <div>Redirecting...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
      <button type="button" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
