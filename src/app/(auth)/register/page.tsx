'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';
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

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const rawData = await response.text();
      console.log('Raw response:', rawData);

      const data = JSON.parse(rawData);

      if (response.ok) {
        setSuccess(
          'User created. Please check your email to verify your account.',
        );
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
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
        {success ? (
          <CardContent className="text-center p-8">
            <CardTitle className="text-2xl mb-4">
              User Successfully Created! Verify your account.
            </CardTitle>
            <CardDescription>
              Please check your email to verify your account. Follow the
              instructions in the email to complete your registration.
            </CardDescription>
            <div className="mt-6">
              <Link href="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="Max" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Robinson" required />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <ClipLoader color="#000" size={20} />
                  ) : (
                    'Create an account'
                  )}
                </Button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button variant="outline" className="w-full" disabled={loading}>
                  <FcGoogle className="mx-2" />
                  Login with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="underline">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
