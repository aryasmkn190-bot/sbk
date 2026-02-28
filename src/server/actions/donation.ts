'use server'

import { query, queryFirst, execute, generateId, nowWIB } from '@/db/client'

/* ───── Types ───── */
export type DonationRow = {
    id: string
    campaign_id: string
    campaign_title?: string
    donor_name: string
    donor_email: string
    donor_phone: string
    amount: number
    message: string
    is_anonymous: number
    payment_method: string
    payment_proof: string
    status: string
    verified_by: string
    verified_at: string
    created_at: string
}

export type DonationInput = {
    campaign_id: string
    donor_name: string
    donor_email: string
    donor_phone?: string
    amount: number
    message?: string
    is_anonymous?: boolean
    payment_method?: string
}

/* ───── READ ───── */

export async function getDonations(statusFilter?: string) {
    let sql = `
        SELECT d.*, c.title as campaign_title
        FROM donations d
        LEFT JOIN campaigns c ON d.campaign_id = c.id
    `
    const params: unknown[] = []

    if (statusFilter && statusFilter !== 'all') {
        sql += ' WHERE d.status = ?'
        params.push(statusFilter)
    }

    sql += ' ORDER BY d.created_at DESC'

    return query<DonationRow>(sql, params)
}

export async function getDonationById(id: string) {
    return queryFirst<DonationRow>(
        `SELECT d.*, c.title as campaign_title
         FROM donations d
         LEFT JOIN campaigns c ON d.campaign_id = c.id
         WHERE d.id = ?`,
        [id]
    )
}

export async function getRecentDonations(limit = 5) {
    return query<DonationRow>(
        `SELECT d.*, c.title as campaign_title
         FROM donations d
         LEFT JOIN campaigns c ON d.campaign_id = c.id
         ORDER BY d.created_at DESC LIMIT ?`,
        [limit]
    )
}

export async function getDonationSummary() {
    const pending = await queryFirst<{ count: number; total: number }>(
        `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
         FROM donations WHERE status = 'pending'`
    )
    const verifiedThisMonth = await queryFirst<{ total: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM donations 
         WHERE status = 'verified' AND created_at >= datetime('now', 'start of month')`
    )
    const totalAll = await queryFirst<{ total: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE status = 'verified'`
    )

    return {
        pendingCount: pending?.count || 0,
        pendingTotal: pending?.total || 0,
        verifiedThisMonth: verifiedThisMonth?.total || 0,
        totalAll: totalAll?.total || 0,
    }
}

/* ───── CREATE ───── */

export async function createDonation(data: DonationInput) {
    const id = generateId()

    await execute(
        `INSERT INTO donations (id, campaign_id, donor_name, donor_email, donor_phone, amount, message, is_anonymous, payment_method, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id, data.campaign_id, data.donor_name, data.donor_email,
            data.donor_phone || '', data.amount, data.message || '',
            data.is_anonymous ? 1 : 0, data.payment_method || 'transfer',
            nowWIB()
        ]
    )

    return { id }
}

/* ───── PAYMENT PROOF ───── */

export async function updatePaymentProof(id: string, proofUrl: string) {
    await execute(
        `UPDATE donations SET payment_proof = ? WHERE id = ?`,
        [proofUrl, id]
    )
}

/* ───── VERIFY / REJECT ───── */

export async function verifyDonation(id: string, verifiedBy: string = 'admin-001') {
    // Get the donation first
    const donation = await getDonationById(id)
    if (!donation) throw new Error('Donasi tidak ditemukan')

    // Update donation status
    await execute(
        `UPDATE donations SET status = 'verified', verified_by = ?, verified_at = ? WHERE id = ?`,
        [verifiedBy, nowWIB(), id]
    )

    // Update the campaign collected amount and donor count
    await execute(
        `UPDATE campaigns SET 
            collected_amount = collected_amount + ?,
            donor_count = donor_count + 1,
            updated_at = ?
         WHERE id = ?`,
        [donation.amount, nowWIB(), donation.campaign_id]
    )
}

export async function rejectDonation(id: string) {
    await execute(
        `UPDATE donations SET status = 'rejected' WHERE id = ?`,
        [id]
    )
}

/* ───── DELETE ───── */

export async function deleteDonation(id: string) {
    await execute('DELETE FROM donations WHERE id = ?', [id])
}
