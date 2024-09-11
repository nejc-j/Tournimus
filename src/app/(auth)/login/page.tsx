'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Default to home page if no callbackUrl

  // Handle form submission for credentials login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      username: email, // Pass the email as username
      password,
    });

    if (res?.error) {
      // Check for specific error messages
      if (res.error.includes('Please')) {
        setError('Please verify your email before logging in.');
      } else {
        setError('Invalid credentials, please try again.');
      }
    } else if (res?.ok) {
      // Redirect to the previous page after successful login
      router.push(callbackUrl);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Image
        src="/background-stadium.png"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <Card className="mx-auto max-w-sm bg-primary/60 backdrop-blur-md text-white border-tertiary/50">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="mx-2" />
              Login with Google
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
