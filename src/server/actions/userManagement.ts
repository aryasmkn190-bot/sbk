'use server'

import { query, queryFirst, execute, generateId, nowWIB } from '@/db/client'

/* ───── Types ───── */
export type UserRow = {
    id: string
    email: string
    name: string
    avatar: string
    phone: string
    role: string
    is_active: number
    created_at: string
    updated_at: string
}

export type UserInput = {
    email: string
    password: string
    name: string
    phone?: string
    role?: string
}

/* ───── READ ───── */

export async function getUsers() {
    return query<UserRow>(
        `SELECT id, email, name, avatar, phone, role, is_active, created_at, updated_at
         FROM users ORDER BY created_at DESC`
    )
}

export async function getUserById(id: string) {
    return queryFirst<UserRow>(
        `SELECT id, email, name, avatar, phone, role, is_active, created_at, updated_at
         FROM users WHERE id = ?`,
        [id]
    )
}

export async function getUserByEmail(email: string) {
    return queryFirst<UserRow & { password: string }>(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    )
}

/* ───── CREATE ───── */

export async function createUser(data: UserInput) {
    const id = generateId()

    await execute(
        `INSERT INTO users (id, email, password, name, phone, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.email, data.password, data.name, data.phone || '', data.role || 'donor']
    )

    return { id }
}

/* ───── UPDATE ───── */

export async function updateUser(id: string, data: Partial<Omit<UserInput, 'password'> & { is_active?: boolean }>) {
    const fields: string[] = []
    const params: unknown[] = []

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name) }
    if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email) }
    if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone) }
    if (data.role !== undefined) { fields.push('role = ?'); params.push(data.role) }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active ? 1 : 0) }

    fields.push('updated_at = ?')
    params.push(nowWIB())
    params.push(id)

    await execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params)
}

/* ───── DELETE ───── */

export async function deleteUser(id: string) {
    await execute('DELETE FROM users WHERE id = ?', [id])
}
