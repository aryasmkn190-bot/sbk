'use server'

/**
 * Upload Image — Supabase Storage
 */

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(url, key)
}

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = `uploads/${filename}`

    const supabase = getSupabase()

    const { error } = await supabase.storage
        .from('sbk-uploads')
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (error) {
        console.error('Supabase storage upload error:', error)
        throw new Error('Upload gagal: ' + error.message)
    }

    // Get public URL
    const { data } = supabase.storage
        .from('sbk-uploads')
        .getPublicUrl(filePath)

    return { url: data.publicUrl }
}
