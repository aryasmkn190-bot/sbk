'use server'

import { query, queryFirst, execute, nowWIB } from '@/db/client'

/* ───── Types ───── */
export type ContactRow = {
    id: string
    name: string
    email: string
    phone: string
    subject: string
    message: string
    is_read: number
    replied_at: string
    created_at: string
}

/* ───── READ ───── */

export async function getContacts() {
    return query<ContactRow>(`SELECT * FROM contacts ORDER BY created_at DESC`)
}

export async function getContactById(id: string) {
    return queryFirst<ContactRow>(`SELECT * FROM contacts WHERE id = ?`, [id])
}

export async function getUnreadCount() {
    const result = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM contacts WHERE is_read = 0`
    )
    return result?.count || 0
}

/* ───── UPDATE ───── */

export async function markContactAsRead(id: string) {
    await execute(`UPDATE contacts SET is_read = 1 WHERE id = ?`, [id])
}

export async function markContactAsReplied(id: string) {
    await execute(`UPDATE contacts SET replied_at = ? WHERE id = ?`, [nowWIB(), id])
}

/* ───── DELETE ───── */

export async function deleteContact(id: string) {
    await execute('DELETE FROM contacts WHERE id = ?', [id])
}
