'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Input, Select, Notification, toast, Upload } from '@/components/ui'
import { PiArrowLeftDuotone, PiFloppyDiskDuotone, PiUploadDuotone } from 'react-icons/pi'
import Link from 'next/link'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { uploadImage } from '@/server/actions/upload'
import { useRouter, useParams } from 'next/navigation'
import { createNews, getNewsById, updateNews } from '@/server/actions/news'
import { getNewsCategories, type CategoryRow } from '@/server/actions/settings'

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Publikasi' },
]

const BeritaEditPage = () => {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string
    const isEditing = id !== 'create'
    const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category_id: '',
        status: 'draft',
    })

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await getNewsCategories()
            setCategories(cats.map((c: CategoryRow) => ({ value: c.id, label: c.name })))
        }

        const loadNewsData = async () => {
            if (isEditing && id) {
                const news = await getNewsById(id)
                if (news) {
                    setFormData({
                        title: news.title,
                        excerpt: news.excerpt,
                        content: news.content,
                        image: news.image,
                        category_id: news.category_id || '',
                        status: news.status,
                    })
                }
            }
        }

        loadCategories()
        loadNewsData()
    }, [id, isEditing])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = async (files: File[]) => {
        if (files.length === 0) return
        try {
            const data = new FormData()
            data.append('file', files[0])
            const res = await uploadImage(data)
            handleChange('image', res.url)
            toast.push(<Notification type="success" title="Berhasil">Gambar berhasil diunggah.</Notification>)
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal mengunggah gambar.</Notification>)
        }
    }

    const handleSubmit = async (status?: string) => {
        if (!formData.title || !formData.content) {
            toast.push(<Notification type="warning" title="Peringatan">Judul dan konten wajib diisi.</Notification>)
            return
        }

        setSubmitting(true)
        try {
            const submitData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                image: formData.image || undefined,
                category_id: formData.category_id || undefined,
                status: status || formData.status,
            }

            if (isEditing) {
                await updateNews(id, submitData)
                toast.push(<Notification type="success" title="Berhasil">Berita berhasil diperbarui!</Notification>)
            } else {
                await createNews(submitData)
                toast.push(<Notification type="success" title="Berhasil">Berita berhasil dibuat!</Notification>)
            }
            router.push('/dashboard/berita')
        } catch (error: any) {
            console.error('Error saving news:', error)
            toast.push(<Notification type="danger" title="Error">{error?.message || 'Gagal menyimpan berita.'}</Notification>)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Link href="/dashboard/berita" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
                <PiArrowLeftDuotone /> Kembali ke Daftar Berita
            </Link>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-4">Informasi Berita</h5>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Berita *</label>
                                    <Input placeholder="Masukkan judul berita..." value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ringkasan</label>
                                    <Input textArea placeholder="Tulis ringkasan berita..." value={formData.excerpt} onChange={(e) => handleChange('excerpt', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konten *</label>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <RichTextEditor
                                            content={formData.content}
                                            onChange={({ html }) => handleChange('content', html)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-4">Gambar Berita</h5>
                            <Upload
                                draggable
                                onChange={(files) => handleImageUpload(files)}
                                showList={false}
                                accept="image/*"
                            >
                                <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer w-full bg-gray-50 dark:bg-gray-800">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="mx-auto max-h-48 object-contain rounded-lg mb-3 shadow-md" />
                                    ) : (
                                        <PiUploadDuotone className="text-4xl mx-auto mb-3 text-gray-400" />
                                    )}
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        {formData.image ? 'Ubah Gambar' : 'Pilih atau letakkan gambar di sini'}
                                    </p>
                                    <p className="text-xs text-gray-500">Mendukung format PNG, JPG, WebP (Maks. 2MB)</p>
                                </div>
                            </Upload>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-4">Pengaturan</h5>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                    <Select options={categories} placeholder="Pilih kategori..." onChange={(option) => handleChange('category_id', (option as { value: string })?.value || '')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <Select options={statusOptions} defaultValue={statusOptions[0]} onChange={(option) => handleChange('status', (option as { value: string })?.value || 'draft')} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="flex flex-col gap-2">
                        <Button variant="solid" block icon={<PiFloppyDiskDuotone />} loading={submitting} onClick={() => handleSubmit()}>{isEditing ? 'Simpan Perubahan' : 'Simpan'}</Button>
                        <Button variant="default" block onClick={() => handleSubmit('published')} loading={submitting}>Simpan & Publikasikan</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BeritaEditPage
