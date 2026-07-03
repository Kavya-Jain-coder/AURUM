/**
 * NextAuth.js catch-all API route
 * Handles: /api/auth/signin, /api/auth/signout, /api/auth/callback/*, etc.
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
