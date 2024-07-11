'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };

    const username = target.username.value;
    const password = target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (!result?.error) {
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
      console.error(result.error);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div>
      {!session ? (
        <form onSubmit={handleSubmit}>
          <input name="username" type="text" placeholder="Username" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign in</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <button type="button" onClick={() => signOut()}>
          Sign out
        </button>
      )}
    </div>
  );
}
