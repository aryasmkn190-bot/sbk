'use server'

import { query, queryFirst, execute, generateId, slugify, nowWIB } from '@/db/client'

/* ───── Types ───── */
export type CampaignRow = {
    id: string
    title: string
    slug: string
    description: string
    content: string
    image: string
    category_id: string
    category_name?: string
    target_amount: number
    collected_amount: number
    donor_count: number
    start_date: string
    end_date: string
    status: string
    is_featured: number
    created_by: string
    created_at: string
    updated_at: string
}

export type CampaignInput = {
    title: string
    description: string
    content?: string
    image?: string
    category_id?: string
    target_amount: number
    start_date: string
    end_date?: string
    status?: string
    is_featured?: boolean
}

/* ───── READ ───── */

export async function getCampaigns(statusFilter?: string) {
    let sql = `
        SELECT c.*, cat.name as category_name 
        FROM campaigns c 
        LEFT JOIN categories cat ON c.category_id = cat.id
    `
    const params: unknown[] = []

    if (statusFilter && statusFilter !== 'all') {
        sql += ' WHERE c.status = ?'
        params.push(statusFilter)
    }

    sql += ' ORDER BY c.created_at DESC'

    return query<CampaignRow>(sql, params)
}

export async function getCampaignById(id: string) {
    return queryFirst<CampaignRow>(
        `SELECT c.*, cat.name as category_name 
         FROM campaigns c 
         LEFT JOIN categories cat ON c.category_id = cat.id 
         WHERE c.id = ?`,
        [id]
    )
}

export async function getCampaignBySlug(slug: string) {
    return queryFirst<CampaignRow>(
        `SELECT c.*, cat.name as category_name 
         FROM campaigns c 
         LEFT JOIN categories cat ON c.category_id = cat.id 
         WHERE c.slug = ?`,
        [slug]
    )
}

export async function getActiveCampaigns(limit?: number) {
    let sql = `
        SELECT c.*, cat.name as category_name 
        FROM campaigns c 
        LEFT JOIN categories cat ON c.category_id = cat.id 
        WHERE c.status = 'active' 
        ORDER BY c.is_featured DESC, c.created_at DESC
    `
    if (limit) sql += ` LIMIT ${limit}`
    return query<CampaignRow>(sql)
}

export async function getFeaturedCampaigns() {
    return query<CampaignRow>(
        `SELECT c.*, cat.name as category_name 
         FROM campaigns c 
         LEFT JOIN categories cat ON c.category_id = cat.id 
         WHERE c.status = 'active' AND c.is_featured = 1 
         ORDER BY c.created_at DESC 
         LIMIT 3`
    )
}

/* ───── STATS ───── */

export async function getCampaignStats() {
    const totalDonations = await queryFirst<{ total: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE status = 'verified'`
    )
    const activeCampaigns = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'`
    )
    const totalDonors = await queryFirst<{ count: number }>(
        `SELECT COUNT(DISTINCT donor_email) as count FROM donations WHERE status = 'verified'`
    )
    const publishedNews = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM news WHERE status = 'published'`
    )
    const pendingDonations = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM donations WHERE status = 'pending'`
    )
    const thisMonthDonations = await queryFirst<{ total: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM donations 
         WHERE status = 'verified' 
         AND created_at >= datetime('now', 'start of month')`
    )
    const unreadContacts = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM contacts WHERE is_read = 0`
    )

    return {
        totalDonations: totalDonations?.total || 0,
        activeCampaigns: activeCampaigns?.count || 0,
        totalDonors: totalDonors?.count || 0,
        publishedNews: publishedNews?.count || 0,
        pendingDonations: pendingDonations?.count || 0,
        thisMonthDonations: thisMonthDonations?.total || 0,
        unreadContacts: unreadContacts?.count || 0,
    }
}

/* ───── CREATE ───── */

export async function createCampaign(data: CampaignInput, createdBy: string = 'admin-001') {
    const id = generateId()
    const slug = slugify(data.title) + '-' + Date.now().toString(36)

    try {
        await execute(
            `INSERT INTO campaigns (id, title, slug, description, content, image, category_id, target_amount, start_date, end_date, status, is_featured, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, data.title, slug, data.description || '',
                data.content || '', data.image || '', data.category_id || null,
                data.target_amount, data.start_date, data.end_date || null,
                data.status || 'draft', data.is_featured ? 1 : 0, createdBy
            ]
        )
    } catch (error: any) {
        console.error('createCampaign error:', error)
        throw new Error('Gagal menyimpan campaign: ' + (error?.message || 'Unknown error'))
    }

    return { id, slug }
}

/* ───── UPDATE ───── */

export async function updateCampaign(id: string, data: Partial<CampaignInput>) {
    const fields: string[] = []
    const params: unknown[] = []

    if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title) }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description) }
    if (data.content !== undefined) { fields.push('content = ?'); params.push(data.content) }
    if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image) }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id) }
    if (data.target_amount !== undefined) { fields.push('target_amount = ?'); params.push(data.target_amount) }
    if (data.start_date !== undefined) { fields.push('start_date = ?'); params.push(data.start_date) }
    if (data.end_date !== undefined) { fields.push('end_date = ?'); params.push(data.end_date) }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status) }
    if (data.is_featured !== undefined) { fields.push('is_featured = ?'); params.push(data.is_featured ? 1 : 0) }

    fields.push('updated_at = ?')
    params.push(nowWIB())
    params.push(id)

    await execute(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, params)
}

/* ───── DELETE ───── */

export async function deleteCampaign(id: string) {
    await execute('DELETE FROM donations WHERE campaign_id = ?', [id])
    await execute('DELETE FROM campaigns WHERE id = ?', [id])
}
