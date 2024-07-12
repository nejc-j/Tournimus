import NextAuth, { User, NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export const BASE_PATH = '/api/auth';

const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        // Find the user by email (assuming username is the email)
        const user = await prisma.user.findUnique({
          where: { email: credentials.username as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare the password
        const isValidPassword = await compare(
          credentials.password as string,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        if (!user.verified) {
          throw new Error('Please verify your email before logging in.');
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
