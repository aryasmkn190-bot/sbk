'use server'

import { query, queryFirst, execute, generateId, slugify, nowWIB } from '@/db/client'

/* ───── Types ───── */
export type NewsRow = {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    image: string
    category_id: string
    category_name?: string
    author_id: string
    author_name?: string
    status: string
    view_count: number
    published_at: string
    created_at: string
    updated_at: string
}

export type NewsInput = {
    title: string
    excerpt?: string
    content: string
    image?: string
    category_id?: string
    status?: string
}

/* ───── READ ───── */

export async function getNews(statusFilter?: string) {
    let sql = `
        SELECT n.*, cat.name as category_name, u.name as author_name
        FROM news n
        LEFT JOIN categories cat ON n.category_id = cat.id
        LEFT JOIN users u ON n.author_id = u.id
    `
    const params: unknown[] = []

    if (statusFilter && statusFilter !== 'all') {
        sql += ' WHERE n.status = ?'
        params.push(statusFilter)
    }

    sql += ' ORDER BY n.created_at DESC'

    return query<NewsRow>(sql, params)
}

export async function getNewsById(id: string) {
    return queryFirst<NewsRow>(
        `SELECT n.*, cat.name as category_name, u.name as author_name
         FROM news n
         LEFT JOIN categories cat ON n.category_id = cat.id
         LEFT JOIN users u ON n.author_id = u.id
         WHERE n.id = ?`,
        [id]
    )
}

export async function getPublishedNews(limit?: number) {
    let sql = `
        SELECT n.*, cat.name as category_name, u.name as author_name
        FROM news n
        LEFT JOIN categories cat ON n.category_id = cat.id
        LEFT JOIN users u ON n.author_id = u.id
        WHERE n.status = 'published'
        ORDER BY n.published_at DESC
    `
    if (limit) sql += ` LIMIT ${limit}`
    return query<NewsRow>(sql)
}

/* ───── CREATE ───── */

export async function createNews(data: NewsInput, authorId: string = 'admin-001') {
    const id = generateId()
    const slug = slugify(data.title) + '-' + Date.now().toString(36)
    const status = data.status || 'draft'
    const publishedAt = status === 'published' ? nowWIB() : null

    try {
        await execute(
            `INSERT INTO news (id, title, slug, excerpt, content, image, category_id, author_id, status, published_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, data.title, slug, data.excerpt || '',
                data.content || '', data.image || '', data.category_id || null,
                authorId, status, publishedAt, nowWIB()
            ]
        )
    } catch (error: any) {
        console.error('createNews error:', error)
        throw new Error('Gagal menyimpan berita: ' + (error?.message || 'Unknown error'))
    }

    return { id, slug }
}

/* ───── UPDATE ───── */

export async function updateNews(id: string, data: Partial<NewsInput>) {
    const fields: string[] = []
    const params: unknown[] = []

    if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title) }
    if (data.excerpt !== undefined) { fields.push('excerpt = ?'); params.push(data.excerpt) }
    if (data.content !== undefined) { fields.push('content = ?'); params.push(data.content) }
    if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image) }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id) }
    if (data.status !== undefined) {
        fields.push('status = ?')
        params.push(data.status)
        if (data.status === 'published') {
            fields.push('published_at = ?')
            params.push(nowWIB())
        }
    }

    fields.push('updated_at = ?')
    params.push(nowWIB())
    params.push(id)

    await execute(`UPDATE news SET ${fields.join(', ')} WHERE id = ?`, params)
}

/* ───── DELETE ───── */

export async function deleteNews(id: string) {
    await execute('DELETE FROM news WHERE id = ?', [id])
}
