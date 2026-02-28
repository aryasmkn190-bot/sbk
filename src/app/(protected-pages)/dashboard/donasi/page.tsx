'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Dialog, Notification, toast, Select, Pagination } from '@/components/ui'
import { PiMagnifyingGlassDuotone, PiCheckCircleDuotone, PiXCircleDuotone, PiEyeDuotone } from 'react-icons/pi'
import { getDonations, getDonationSummary, verifyDonation, rejectDonation, type DonationRow } from '@/server/actions/donation'

const statusColors: Record<string, string> = {
    pending: 'bg-warning-subtle text-warning',
    verified: 'bg-success-subtle text-success',
    rejected: 'bg-error-subtle text-error',
}

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    verified: 'Terverifikasi',
    rejected: 'Ditolak',
}

const filterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'verified', label: 'Terverifikasi' },
    { value: 'rejected', label: 'Ditolak' },
]

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

const DonasiPage = () => {
    const [donations, setDonations] = useState<DonationRow[]>([])
    const [summary, setSummary] = useState({ pendingCount: 0, pendingTotal: 0, verifiedThisMonth: 0, totalAll: 0 })
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [detailOpen, setDetailOpen] = useState(false)
    const [selectedDonation, setSelectedDonation] = useState<DonationRow | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const loadData = async () => {
        try {
            const [donationsData, summaryData] = await Promise.all([getDonations(), getDonationSummary()])
            setDonations(donationsData)
            setSummary(summaryData)
        } catch (error) {
            console.error('Error loading donations:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const filtered = donations.filter((d) => {
        const matchSearch = d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) || (d.campaign_title || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'all' || d.status === statusFilter
        return matchSearch && matchStatus
    })

    const paginatedDonations = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filtered.slice(start, start + pageSize)
    }, [filtered, currentPage, pageSize])

    useEffect(() => { setCurrentPage(1) }, [searchTerm, statusFilter])

    const handleVerify = async (donation: DonationRow) => {
        try {
            await verifyDonation(donation.id)
            toast.push(<Notification type="success" title="Donasi Diverifikasi">{formatCurrency(donation.amount)} dari {donation.is_anonymous ? 'Anonim' : donation.donor_name} telah diverifikasi.</Notification>)
            setDetailOpen(false)
            loadData()
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal memverifikasi donasi.</Notification>)
        }
    }

    const handleReject = async (donation: DonationRow) => {
        try {
            await rejectDonation(donation.id)
            toast.push(<Notification type="warning" title="Donasi Ditolak">Donasi dari {donation.is_anonymous ? 'Anonim' : donation.donor_name} telah ditolak.</Notification>)
            setDetailOpen(false)
            loadData()
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal menolak donasi.</Notification>)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-l-warning">
                    <p className="text-sm text-gray-500">Menunggu Verifikasi</p>
                    <p className="text-2xl font-bold text-warning">{summary.pendingCount}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-success">
                    <p className="text-sm text-gray-500">Terverifikasi (Bulan Ini)</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(summary.verifiedThisMonth)}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-primary">
                    <p className="text-sm text-gray-500">Total Semua Donasi</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(summary.totalAll)}</p>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                    <PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Cari donatur atau campaign..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="w-48">
                    <Select size="md" options={filterOptions} defaultValue={filterOptions[0]} onChange={(option) => setStatusFilter((option as { value: string })?.value || 'all')} />
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Memuat data...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500">Donatur</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Campaign</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Jumlah</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Metode</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Tanggal</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedDonations.map((donation) => (
                                    <tr key={donation.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{donation.is_anonymous ? 'Anonim' : donation.donor_name}</p>
                                            <p className="text-xs text-gray-500">{donation.donor_email}</p>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-[180px] truncate">{donation.campaign_title}</td>
                                        <td className="py-4 px-4 text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(donation.amount)}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{donation.payment_method}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[donation.status]}`}>{statusLabels[donation.status]}</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{donation.created_at}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button size="xs" variant="plain" icon={<PiEyeDuotone className="text-lg" />}
                                                    onClick={() => { setSelectedDonation(donation); setDetailOpen(true) }} />
                                                {donation.status === 'pending' && (
                                                    <>
                                                        <Button size="xs" variant="plain" icon={<PiCheckCircleDuotone className="text-lg text-success" />} onClick={() => handleVerify(donation)} />
                                                        <Button size="xs" variant="plain" icon={<PiXCircleDuotone className="text-lg text-error" />} onClick={() => handleReject(donation)} />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && filtered.length > pageSize && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500">
                            Menampilkan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length}
                        </span>
                        <Pagination
                            total={filtered.length}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </Card>

            <Dialog isOpen={detailOpen} onClose={() => setDetailOpen(false)} onRequestClose={() => setDetailOpen(false)}>
                {selectedDonation && (
                    <div>
                        <h5 className="mb-4 font-bold">Detail Donasi</h5>
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Donatur:</span><span className="font-medium">{selectedDonation.is_anonymous ? 'Anonim' : selectedDonation.donor_name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Email:</span><span>{selectedDonation.donor_email}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Telepon:</span><span>{selectedDonation.donor_phone || '-'}</span></div>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div className="flex justify-between"><span className="text-gray-500">Campaign:</span><span className="font-medium">{selectedDonation.campaign_title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Jumlah:</span><span className="font-bold text-primary">{formatCurrency(selectedDonation.amount)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Metode:</span><span>{selectedDonation.payment_method}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Tanggal:</span><span>{selectedDonation.created_at}</span></div>
                            {selectedDonation.message && (
                                <><hr className="border-gray-200 dark:border-gray-700" /><div><span className="text-gray-500 block mb-1">Pesan:</span><p className="italic">&quot;{selectedDonation.message}&quot;</p></div></>
                            )}
                            {selectedDonation.payment_proof && (
                                <>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <div>
                                        <span className="text-gray-500 block mb-2">Bukti Transfer:</span>
                                        <img src={selectedDonation.payment_proof} alt="Bukti transfer" className="w-full max-h-64 object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between items-center"><span className="text-gray-500">Status:</span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[selectedDonation.status]}`}>{statusLabels[selectedDonation.status]}</span>
                            </div>
                        </div>
                        {selectedDonation.status === 'pending' && (
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="default" onClick={() => handleReject(selectedDonation)}>Tolak</Button>
                                <Button variant="solid" onClick={() => handleVerify(selectedDonation)}>Verifikasi</Button>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default DonasiPage
