'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Select, Notification, toast, Pagination } from '@/components/ui'
import { PiPlusCircleDuotone, PiPencilDuotone, PiTrashDuotone, PiEyeDuotone, PiMagnifyingGlassDuotone } from 'react-icons/pi'
import Link from 'next/link'
import { getNews, deleteNews, type NewsRow } from '@/server/actions/news'

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    published: 'bg-success-subtle text-success',
    archived: 'bg-warning-subtle text-warning',
}

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    published: 'Dipublikasi',
    archived: 'Diarsipkan',
}

const filterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'published', label: 'Dipublikasi' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Diarsipkan' },
]

const BeritaPage = () => {
    const [news, setNews] = useState<NewsRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const loadNews = async () => {
        try {
            const data = await getNews()
            setNews(data)
        } catch (error) {
            console.error('Error loading news:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadNews() }, [])

    const filtered = news.filter((n) => {
        const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'all' || n.status === statusFilter
        return matchSearch && matchStatus
    })

    const paginatedNews = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filtered.slice(start, start + pageSize)
    }, [filtered, currentPage, pageSize])

    useEffect(() => { setCurrentPage(1) }, [searchTerm, statusFilter])

    const handleDelete = async (item: NewsRow) => {
        if (confirm(`Hapus berita "${item.title}"?`)) {
            try {
                await deleteNews(item.id)
                toast.push(<Notification type="success" title="Berhasil">Berita berhasil dihapus.</Notification>)
                loadNews()
            } catch (error) {
                toast.push(<Notification type="danger" title="Error">Gagal menghapus berita.</Notification>)
            }
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Cari berita..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="w-40">
                        <Select size="md" options={filterOptions} defaultValue={filterOptions[0]} onChange={(option) => setStatusFilter((option as { value: string })?.value || 'all')} />
                    </div>
                </div>
                <Link href="/dashboard/berita/create">
                    <Button variant="solid" icon={<PiPlusCircleDuotone />}>Tulis Berita</Button>
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
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500">Judul</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Kategori</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Penulis</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Views</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Tanggal</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedNews.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                                            <p className="text-xs text-gray-500 max-w-[250px] truncate">{item.excerpt}</p>
                                        </td>
                                        <td className="py-4 px-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-subtle text-primary">{item.category_name || '-'}</span></td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{item.author_name || '-'}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{item.view_count.toLocaleString()}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>{statusLabels[item.status]}</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{item.published_at || item.created_at}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button size="xs" variant="plain" icon={<PiEyeDuotone className="text-lg" />} />
                                                <Link href={`/dashboard/berita/${item.id}`}>
                                                    <Button size="xs" variant="plain" icon={<PiPencilDuotone className="text-lg" />} />
                                                </Link>
                                                <Button size="xs" variant="plain" icon={<PiTrashDuotone className="text-lg text-error" />} onClick={() => handleDelete(item)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-500">Tidak ada berita ditemukan.</div>
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
        </div>
    )
}

export default BeritaPage
