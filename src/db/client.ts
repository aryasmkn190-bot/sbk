/**
 * Supabase Database Client
 * Uses @supabase/supabase-js for PostgreSQL queries
 */

import { createClient } from '@supabase/supabase-js'

/* ───── Supabase Client (singleton) ───── */
let supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
    if (supabase) return supabase

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    }

    supabase = createClient(url, key)
    return supabase
}

/* ───── Helper: generate UUID-like ID ───── */
export function generateId(): string {
    const bytes = new Uint8Array(16)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(bytes)
    } else {
        for (let i = 0; i < 16; i++) {
            bytes[i] = Math.floor(Math.random() * 256)
        }
    }
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

/* ───── Helper: create URL slug ───── */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

/* ───── Helper: current datetime in WIB (UTC+7) ───── */
export function nowWIB(): string {
    const now = new Date()
    const wib = new Date(now.getTime() + (7 * 60 * 60 * 1000))
    return wib.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19)
}

/* ───── Query: returns array of results ───── */
export async function query<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
): Promise<T[]> {
    const sb = getSupabase()
    const { data, error } = await (sb.rpc as any)('raw_sql', {
        query_text: replaceParams(sql, params)
    })
    if (error) {
        console.error('Supabase query error:', error.message, sql)
        throw new Error(error.message)
    }
    return (data || []) as T[]
}

/* ───── QueryFirst: returns first result or null ───── */
export async function queryFirst<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
): Promise<T | null> {
    const results = await query<T>(sql, params)
    return results[0] || null
}

/* ───── Execute: INSERT/UPDATE/DELETE ───── */
export async function execute(
    sql: string,
    params: unknown[] = []
): Promise<{ changes: number; lastInsertRowid: number | bigint }> {
    const sb = getSupabase()
    const { data, error } = await (sb.rpc as any)('raw_sql', {
        query_text: replaceParams(sql, params)
    })
    if (error) {
        console.error('Supabase execute error:', error.message, sql)
        throw new Error(error.message)
    }
    return { changes: 1, lastInsertRowid: 0 }
}

/* ───── Replace ? placeholders with $1, $2, ... and inline values ───── */
function replaceParams(sql: string, params: unknown[]): string {
    if (params.length === 0) return sql

    let idx = 0
    const replaced = sql.replace(/\?/g, () => {
        const val = params[idx++]
        if (val === null || val === undefined) return 'NULL'
        if (typeof val === 'number') return String(val)
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
        // Escape single quotes for SQL injection prevention
        const escaped = String(val).replace(/'/g, "''")
        return `'${escaped}'`
    })
    return replaced
}

export default {
    query,
    queryFirst,
    execute,
    generateId,
    slugify,
    nowWIB,
}
