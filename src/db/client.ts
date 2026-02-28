/**
 * D1 Database Client — Dual Mode
 *
 * - Local dev: uses better-sqlite3
 * - Production (Cloudflare Workers): uses D1 binding
 */

/* ───── Helper: generate UUID-like ID ───── */
export function generateId(): string {
    const bytes = new Uint8Array(16)
    for (let i = 0; i < 16; i++) {
        bytes[i] = Math.floor(Math.random() * 256)
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

/* ───── Detect Environment ───── */
function isCloudflare(): boolean {
    return typeof process === 'undefined' || !!(globalThis as any).__cf_env__
}

/* ───── Get D1 binding from Cloudflare context ───── */
function getD1(): any {
    // In Cloudflare Workers, the env is available via globalThis or process.env
    const env = (globalThis as any).__cf_env__ || (globalThis as any).process?.env
    if (env?.DB) return env.DB
    // Try via getRequestContext if available
    try {
        const ctx = (globalThis as any).__cf_ctx__
        if (ctx?.env?.DB) return ctx.env.DB
    } catch { /* ignore */ }
    return null
}

/* ───── Local Dev: better-sqlite3 ───── */
let localDb: any = null
let initialized = false

function getLocalDatabase(): any {
    if (localDb) return localDb

    const Database = require('better-sqlite3')
    const path = require('path')
    const fs = require('fs')

    const dbPath = path.join(process.cwd(), 'data', 'sbk.db')

    const dataDir = path.dirname(dbPath)
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    localDb = new Database(dbPath)
    localDb.pragma('journal_mode = WAL')
    localDb.pragma('foreign_keys = ON')

    if (!initialized) {
        const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql')
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf-8')
            localDb.exec(schema)
        }
        initialized = true
    }

    return localDb
}

/* ───── Query: returns array of results ───── */
export async function query<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
): Promise<T[]> {
    if (isCloudflare()) {
        const d1 = getD1()
        const result = await d1.prepare(sql).bind(...params).all()
        return (result.results || []) as T[]
    } else {
        const db = getLocalDatabase()
        const stmt = db.prepare(sql)
        return stmt.all(...params) as T[]
    }
}

/* ───── QueryFirst: returns first result or null ───── */
export async function queryFirst<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
): Promise<T | null> {
    if (isCloudflare()) {
        const d1 = getD1()
        const result = await d1.prepare(sql).bind(...params).first()
        return (result as T) || null
    } else {
        const db = getLocalDatabase()
        const stmt = db.prepare(sql)
        return (stmt.get(...params) as T) || null
    }
}

/* ───── Execute: INSERT/UPDATE/DELETE ───── */
export async function execute(
    sql: string,
    params: unknown[] = []
): Promise<{ changes: number; lastInsertRowid: number | bigint }> {
    if (isCloudflare()) {
        const d1 = getD1()
        const result = await d1.prepare(sql).bind(...params).run()
        return {
            changes: result.meta?.changes || 0,
            lastInsertRowid: result.meta?.last_row_id || 0,
        }
    } else {
        const db = getLocalDatabase()
        const stmt = db.prepare(sql)
        const result = stmt.run(...params)
        return {
            changes: result.changes,
            lastInsertRowid: result.lastInsertRowid,
        }
    }
}

/* ───── Transaction ───── */
export async function transaction<T>(
    fn: () => Promise<T>
): Promise<T> {
    if (isCloudflare()) {
        // D1 doesn't support traditional transactions in the same way
        // Just run the function sequentially
        return fn()
    } else {
        const db = getLocalDatabase()
        const runTransaction = db.transaction(() => {
            return fn()
        })
        return runTransaction() as T
    }
}

export default {
    query,
    queryFirst,
    execute,
    transaction,
    generateId,
    slugify,
    nowWIB,
}
