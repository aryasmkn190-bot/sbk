'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Badge, Dialog, Notification, toast, Select, Pagination } from '@/components/ui'
import { PiPlusCircleDuotone, PiPencilDuotone, PiTrashDuotone, PiEyeDuotone, PiMagnifyingGlassDuotone } from 'react-icons/pi'
import Link from 'next/link'
import { getCampaigns, deleteCampaign, type CampaignRow } from '@/server/actions/campaign'

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    active: 'bg-success-subtle text-success',
    completed: 'bg-info-subtle text-info',
    cancelled: 'bg-error-subtle text-error',
}

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    active: 'Aktif',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
}

const filterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'draft', label: 'Draft' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
]

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const loadCampaigns = async () => {
        try {
            const data = await getCampaigns()
            setCampaigns(data)
        } catch (error) {
            console.error('Error loading campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadCampaigns() }, [])

    const filteredCampaigns = campaigns.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'all' || c.status === statusFilter
        return matchSearch && matchStatus
    })

    const totalPages = Math.ceil(filteredCampaigns.length / pageSize)
    const paginatedCampaigns = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredCampaigns.slice(start, start + pageSize)
    }, [filteredCampaigns, currentPage, pageSize])

    useEffect(() => { setCurrentPage(1) }, [searchTerm, statusFilter])

    const handleDelete = async () => {
        if (selectedCampaign) {
            try {
                await deleteCampaign(selectedCampaign.id)
                toast.push(
                    <Notification type="success" title="Campaign Dihapus">
                        Campaign &quot;{selectedCampaign.title}&quot; berhasil dihapus.
                    </Notification>
                )
                loadCampaigns()
            } catch (error) {
                toast.push(<Notification type="danger" title="Error">Gagal menghapus campaign.</Notification>)
            }
        }
        setDeleteDialogOpen(false)
        setSelectedCampaign(null)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Cari campaign..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="w-40">
                        <Select size="md" options={filterOptions} defaultValue={filterOptions[0]} onChange={(option) => setStatusFilter((option as { value: string })?.value || 'all')} />
                    </div>
                </div>
                <Link href="/dashboard/campaigns/create">
                    <Button variant="solid" icon={<PiPlusCircleDuotone />}>Buat Campaign</Button>
                </Link>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Memuat data...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500">Campaign</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Kategori</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Progress</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Donatur</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Periode</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCampaigns.map((campaign) => {
                                    const progress = campaign.target_amount > 0 ? Math.round((campaign.collected_amount / campaign.target_amount) * 100) : 0
                                    return (
                                        <tr key={campaign.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{campaign.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(campaign.collected_amount)} / {formatCurrency(campaign.target_amount)}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className="bg-primary-subtle text-primary">{campaign.category_name || '-'}</Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                                                    </div>
                                                    <span className="text-sm font-medium">{progress}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm">{campaign.donor_count}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                                                    {statusLabels[campaign.status]}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-500">
                                                <div>{campaign.start_date}</div>
                                                <div className="text-xs">s/d {campaign.end_date || '-'}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button size="xs" variant="plain" icon={<PiEyeDuotone className="text-lg" />} />
                                                    <Link href={`/dashboard/campaigns/${campaign.id}`}>
                                                        <Button size="xs" variant="plain" icon={<PiPencilDuotone className="text-lg" />} />
                                                    </Link>
                                                    <Button size="xs" variant="plain" icon={<PiTrashDuotone className="text-lg text-error" />}
                                                        onClick={() => { setSelectedCampaign(campaign); setDeleteDialogOpen(true) }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                    {!loading && filteredCampaigns.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <PiMagnifyingGlassDuotone className="text-4xl mx-auto mb-3 text-gray-300" />
                            <p>Tidak ada campaign ditemukan.</p>
                        </div>
                    )}
                </div>
                {!loading && filteredCampaigns.length > pageSize && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500">
                            Menampilkan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredCampaigns.length)} dari {filteredCampaigns.length}
                        </span>
                        <Pagination
                            total={filteredCampaigns.length}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </Card>

            <Dialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onRequestClose={() => setDeleteDialogOpen(false)}>
                <h5 className="mb-4 font-bold">Hapus Campaign</h5>
                <p className="mb-6 text-gray-500">Apakah Anda yakin ingin menghapus campaign <strong>&quot;{selectedCampaign?.title}&quot;</strong>? Semua data donasi terkait juga akan dihapus.</p>
                <div className="flex justify-end gap-2">
                    <Button variant="plain" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
                    <Button variant="solid" color="red" onClick={handleDelete}>Hapus</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default CampaignsPage
