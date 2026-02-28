'use server'

/**
 * Upload Image — Cloudflare R2 (S3-compatible)
 *
 * Uses @aws-sdk/client-s3 to upload files to Cloudflare R2.
 * R2 is free for egress bandwidth, making it ideal for serving images.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

function getR2Client() {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

    if (!accountId || !accessKeyId || !secretAccessKey) {
        throw new Error('Missing R2 credentials in .env (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)')
    }

    return new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    })
}

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const key = `uploads/${filename}`

    const bucketName = process.env.R2_BUCKET_NAME || 'sbk'
    const publicDomain = process.env.R2_PUBLIC_DOMAIN // e.g. https://cdn.salingbantukreasi.or.id

    const client = getR2Client()

    await client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    }))

    // Return public URL
    // R2_PUBLIC_DOMAIN should be set to your R2.dev URL (e.g. https://pub-xxx.r2.dev)
    // or a custom domain you've configured on the R2 bucket
    if (!publicDomain) {
        console.warn('R2_PUBLIC_DOMAIN not set! Image URLs may not work. Set it to your R2.dev public URL (e.g. https://pub-xxx.r2.dev)')
    }
    const url = publicDomain
        ? `${publicDomain}/${key}`
        : `/${key}` // fallback to relative path

    return { url }
}
