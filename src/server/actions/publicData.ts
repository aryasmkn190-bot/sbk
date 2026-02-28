'use server'

import { query, queryFirst, execute, generateId } from '@/db/client'
import type { NewsRow } from './news'

/* ───── Campaign Donors ───── */

export type DonorListRow = {
    donor_name: string
    amount: number
    message: string
    is_anonymous: number
    created_at: string
}

export async function getCampaignDonors(campaignId: string, limit = 20) {
    return query<DonorListRow>(
        `SELECT donor_name, amount, message, is_anonymous, created_at
         FROM donations
         WHERE campaign_id = ? AND status = 'verified'
         ORDER BY created_at DESC
         LIMIT ?`,
        [campaignId, limit]
    )
}

/* ───── News ───── */

export async function getNewsBySlug(slug: string) {
    // Increment view count
    await execute(`UPDATE news SET view_count = view_count + 1 WHERE slug = ?`, [slug])

    return queryFirst<NewsRow & { category_name: string; author_name: string }>(
        `SELECT n.*, cat.name as category_name, u.name as author_name
         FROM news n
         LEFT JOIN categories cat ON n.category_id = cat.id
         LEFT JOIN users u ON n.author_id = u.id
         WHERE n.slug = ?`,
        [slug]
    )
}

export async function getRelatedNews(newsId: string, categoryId: string, limit = 3) {
    return query<NewsRow & { category_name: string }>(
        `SELECT n.*, cat.name as category_name
         FROM news n
         LEFT JOIN categories cat ON n.category_id = cat.id
         WHERE n.status = 'published' AND n.id != ? AND n.category_id = ?
         ORDER BY n.published_at DESC LIMIT ?`,
        [newsId, categoryId, limit]
    )
}

export async function submitContactForm(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const id = generateId()
    await execute(
        `INSERT INTO contacts (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.name, data.email, data.phone || '', data.subject, data.message]
    )
    return { id }
}
