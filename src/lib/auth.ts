/**
 * NextAuth.js v5 Configuration for AURUM
 */

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

const config: NextAuthConfig = {
  // Conditionally use Drizzle adapter if NeonDB is connected
  adapter: db ? DrizzleAdapter(db) : undefined,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Custom admin credentials
        if (email === 'admin@aurum.com' && password === 'admin123') {
          return {
            id: 'admin-user-id',
            name: 'Maison Admin',
            email: 'admin@aurum.com',
            role: 'admin',
          };
        }

        // Custom guest credentials
        if (email === 'guest@aurum.com' && password === 'guest123') {
          return {
            id: 'guest-user-id',
            name: 'Guest Collector',
            email: 'guest@aurum.com',
            role: 'user',
          };
        }

        // Return a mock user for any other email for demo sign-in
        return {
          id: `demo-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role || (user.email === 'admin@aurum.com' || user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user');
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = (token.role as string) || 'user';
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export default NextAuth(config);
