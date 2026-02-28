'use server'

/**
 * Upload Image — Dual Mode
 *
 * - Local dev: saves to public/uploads/
 * - Production (Cloudflare): saves to R2 bucket
 */

function isCloudflare(): boolean {
    return typeof process === 'undefined' || !!(globalThis as any).__cf_env__
}

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    if (isCloudflare()) {
        // Cloudflare R2
        try {
            const env = (globalThis as any).__cf_env__
            if (env?.STORAGE) {
                await env.STORAGE.put(`uploads/${filename}`, buffer, {
                    httpMetadata: { contentType: file.type },
                })
                // R2 public URL — you'll need to configure a custom domain or public bucket
                return { url: `/uploads/${filename}` }
            }
        } catch (e) {
            console.error('R2 upload error:', e)
        }
        // Fallback: base64 data URL (works anywhere but larger)
        const base64 = buffer.toString('base64')
        return { url: `data:${file.type};base64,${base64}` }
    } else {
        // Local filesystem
        const fs = require('fs/promises') as typeof import('fs/promises')
        const path = require('path') as typeof import('path')

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(path.join(uploadDir, filename), buffer)

        return { url: `/uploads/${filename}` }
    }
}
