import { auth } from '@/auth';
import AuthButton from '../AuthButton.server';

export default async function Login() {
  const session = await auth();
  return (
    <main>
      <h1 className="text-3xl font-bold">Home Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <AuthButton />
    </main>
  );
}
