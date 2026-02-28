'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Input, Select, Notification, toast, Upload } from '@/components/ui'
import { PiArrowLeftDuotone, PiFloppyDiskDuotone, PiUploadDuotone } from 'react-icons/pi'
import Link from 'next/link'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { uploadImage } from '@/server/actions/upload'
import { useRouter, useParams } from 'next/navigation'
import { createCampaign, getCampaignById, updateCampaign } from '@/server/actions/campaign'
import { getCampaignCategories, type CategoryRow } from '@/server/actions/settings'

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Aktif' },
]

const CampaignEditPage = () => {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string
    const isEditing = id !== 'create'
    const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: '',
        category_id: '',
        target_amount: '',
        start_date: '',
        end_date: '',
        status: 'draft',
    })

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await getCampaignCategories()
            setCategories(cats.map((c: CategoryRow) => ({ value: c.id, label: c.name })))
        }

        const loadCampaign = async () => {
            if (isEditing && id) {
                const campaign = await getCampaignById(id)
                if (campaign) {
                    setFormData({
                        title: campaign.title,
                        description: campaign.description,
                        content: campaign.content,
                        image: campaign.image,
                        category_id: campaign.category_id || '',
                        target_amount: String(campaign.target_amount),
                        start_date: campaign.start_date,
                        end_date: campaign.end_date || '',
                        status: campaign.status,
                    })
                }
            }
        }

        loadCategories()
        loadCampaign()
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
        if (!formData.title || !formData.description || !formData.target_amount || !formData.start_date) {
            toast.push(<Notification type="warning" title="Peringatan">Mohon lengkapi field yang wajib diisi.</Notification>)
            return
        }

        setSubmitting(true)
        try {
            const submitData = {
                title: formData.title,
                description: formData.description,
                content: formData.content,
                image: formData.image || undefined,
                category_id: formData.category_id || undefined,
                target_amount: parseFloat(formData.target_amount),
                start_date: formData.start_date,
                end_date: formData.end_date || undefined,
                status: status || formData.status,
            }

            if (isEditing) {
                await updateCampaign(id, submitData)
                toast.push(<Notification type="success" title="Berhasil">Campaign berhasil diperbarui!</Notification>)
            } else {
                await createCampaign(submitData)
                toast.push(<Notification type="success" title="Berhasil">Campaign berhasil dibuat!</Notification>)
            }
            router.push('/dashboard/campaigns')
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal menyimpan campaign.</Notification>)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <Link href="/dashboard/campaigns" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
                    <PiArrowLeftDuotone /> Kembali ke Daftar Campaign
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-4">Informasi Campaign</h5>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Campaign *</label>
                                    <Input placeholder="Masukkan judul campaign..." value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat *</label>
                                    <Input textArea placeholder="Deskripsi singkat campaign..." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konten Detail</label>
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
                            <h5 className="font-bold mb-4">Gambar Campaign</h5>
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                                    <Select options={categories} placeholder="Pilih kategori..." onChange={(option) => handleChange('category_id', (option as { value: string })?.value || '')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <Select options={statusOptions} defaultValue={statusOptions[0]} onChange={(option) => handleChange('status', (option as { value: string })?.value || 'draft')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Donasi (Rp) *</label>
                                    <Input placeholder="50000000" type="number" value={formData.target_amount} onChange={(e) => handleChange('target_amount', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h5 className="font-bold mb-4">Periode Campaign</h5>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Mulai *</label>
                                    <Input type="date" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Berakhir</label>
                                    <Input type="date" value={formData.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="flex flex-col gap-2">
                        <Button variant="solid" block icon={<PiFloppyDiskDuotone />} loading={submitting} onClick={() => handleSubmit()}>
                            {isEditing ? 'Simpan Perubahan' : 'Simpan Campaign'}
                        </Button>
                        <Button variant="default" block onClick={() => handleSubmit('draft')} loading={submitting}>
                            Simpan sebagai Draft
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignEditPage
