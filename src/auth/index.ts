/* eslint-disable no-param-reassign */
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
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? undefined },
        });

        if (!existingUser) {
          // Create a new user if not found
          const newUser = await prisma.user.create({
            data: {
              email: user.email ?? '',
              name: user.name ?? '',
              password: '', // Google sign-in users do not need a password
              verified: true,
            },
          });
          user.id = newUser.id; // Attach the new DB user ID to the user object
        } else {
          // Update the user object with the existing user ID
          user.id = existingUser.id;
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
