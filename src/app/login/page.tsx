import { auth } from '@/auth';
import AuthButton from '../AuthButton.server';

export default async function Login() {
  const session = await auth();
  console.log(session?.user?.id);
  return (
    <main className="mt-[200px]">
      <h1 className="text-3xl font-bold">Home Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <AuthButton />
    </main>
  );
}
