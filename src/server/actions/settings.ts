'use server'

import { query, queryFirst, execute, nowWIB } from '@/db/client'

/* ───── Types ───── */
export type SettingRow = {
    key: string
    value: string
    updated_at: string
}

export type CategoryRow = {
    id: string
    name: string
    slug: string
    type: string
    description: string
    is_active: number
    created_at: string
}

/* ───── Settings ───── */

export async function getSettings() {
    const rows = await query<SettingRow>(`SELECT * FROM settings`)
    const settings: Record<string, string> = {}
    rows.forEach(row => { settings[row.key] = row.value })
    return settings
}

export async function getSetting(key: string) {
    const row = await queryFirst<SettingRow>(`SELECT * FROM settings WHERE key = ?`, [key])
    return row?.value || ''
}

export async function updateSetting(key: string, value: string) {
    await execute(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
        [key, value, nowWIB()]
    )
}

export async function updateSettings(settings: Record<string, string>) {
    for (const [key, value] of Object.entries(settings)) {
        await updateSetting(key, value)
    }
}

/* ───── Categories ───── */

export async function getCategories(type?: string) {
    if (type) {
        return query<CategoryRow>(`SELECT * FROM categories WHERE type = ? ORDER BY name`, [type])
    }
    return query<CategoryRow>(`SELECT * FROM categories ORDER BY type, name`)
}

export async function getCampaignCategories() {
    return getCategories('campaign')
}

export async function getNewsCategories() {
    return getCategories('news')
}
