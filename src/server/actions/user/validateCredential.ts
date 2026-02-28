'use server'
import type { SignInCredential } from '@/@types/auth'
import { queryFirst } from '@/db/client'

type UserRecord = {
    id: string
    email: string
    password: string
    name: string
    avatar: string
    role: string
    is_active: number
}

const validateCredential = async (values: SignInCredential) => {
    const { email, password } = values

    // Query user from D1 database
    const user = await queryFirst<UserRecord>(
        `SELECT id, email, password, name, avatar, role, is_active FROM users WHERE email = ?`,
        [email]
    )

    if (!user) return undefined
    if (user.password !== password) return undefined
    if (!user.is_active) return undefined

    return {
        id: user.id,
        avatar: user.avatar || '',
        userName: user.name,
        email: user.email,
        authority: [user.role],
        password: user.password,
        accountUserName: user.email.split('@')[0],
    }
}

export default validateCredential
