import NextAuth from 'next-auth'
import appConfig from '@/configs/app.config'
import authConfig from '@/configs/auth.config'
import Credentials from 'next-auth/providers/credentials'
import validateCredential from '@/server/actions/user/validateCredential'
import type { SignInCredential } from '@/@types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: appConfig.authenticatedEntryPath,
        error: appConfig.authenticatedEntryPath,
    },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        // Credentials provider with DB access — only runs in Node.js runtime (API routes)
        Credentials({
            async authorize(credentials) {
                const user = await validateCredential(
                    credentials as SignInCredential,
                )
                if (!user) {
                    return null
                }
                return {
                    id: user.id,
                    name: user.userName,
                    email: user.email,
                    image: user.avatar,
                    authority: user.authority,
                }
            },
        }),
    ],
})
