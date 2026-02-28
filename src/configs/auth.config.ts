/**
 * auth.config.ts - Shared auth config used by BOTH middleware and auth.ts
 * 
 * IMPORTANT: This file must NOT import anything that uses Node.js APIs
 * (fs, path, process.cwd, better-sqlite3) because it's used in Edge Runtime (middleware).
 * 
 * Credentials provider with DB access is defined in auth.ts instead.
 */

import type { NextAuthConfig } from 'next-auth'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export default {
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        // NOTE: Credentials provider is added in auth.ts to avoid Edge Runtime issues
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.authority = user.authority
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                },
            }
        },
    },
} satisfies NextAuthConfig
