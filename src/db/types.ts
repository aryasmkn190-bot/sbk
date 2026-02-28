/**
 * D1 Database utility for Saling Bantu Kreasi
 * 
 * For local development, we use better-sqlite3 as a drop-in replacement.
 * In production (Cloudflare Workers/Pages), this will use the D1 binding.
 * 
 * Since Next.js runs on Node.js locally, we use better-sqlite3 for dev
 * and the Cloudflare D1 HTTP API for production.
 */

export interface D1Result<T = unknown> {
    results: T[]
    success: boolean
    meta: {
        changes: number
        last_row_id: number
        duration: number
    }
}

export interface D1Database {
    prepare(query: string): D1PreparedStatement
    exec(query: string): Promise<D1Result>
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
}

export interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement
    first<T = unknown>(colName?: string): Promise<T | null>
    run(): Promise<D1Result>
    all<T = unknown>(): Promise<D1Result<T>>
}
