'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Dialog, Notification, toast, Pagination } from '@/components/ui'
import { PiMagnifyingGlassDuotone, PiEnvelopeSimpleDuotone, PiEnvelopeOpenDuotone, PiCheckDuotone } from 'react-icons/pi'
import { getContacts, markContactAsRead, deleteContact, type ContactRow } from '@/server/actions/contact'

const KontakPage = () => {
    const [contacts, setContacts] = useState<ContactRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [detailOpen, setDetailOpen] = useState(false)
    const [selected, setSelected] = useState<ContactRow | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const loadContacts = async () => {
        try {
            const data = await getContacts()
            setContacts(data)
        } catch (error) {
            console.error('Error loading contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadContacts() }, [])

    const filtered = contacts.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const paginatedContacts = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filtered.slice(start, start + pageSize)
    }, [filtered, currentPage, pageSize])

    useEffect(() => { setCurrentPage(1) }, [searchTerm])

    const unreadCount = contacts.filter(c => !c.is_read).length

    const handleOpen = async (contact: ContactRow) => {
        setSelected(contact)
        setDetailOpen(true)
        if (!contact.is_read) {
            try {
                await markContactAsRead(contact.id)
                loadContacts()
            } catch (error) {
                console.error('Error marking contact as read:', error)
            }
        }
    }

    const handleDelete = async (contact: ContactRow) => {
        try {
            await deleteContact(contact.id)
            toast.push(<Notification type="success" title="Berhasil">Pesan berhasil dihapus.</Notification>)
            setDetailOpen(false)
            loadContacts()
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal menghapus pesan.</Notification>)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 border-l-4 border-l-primary">
                    <p className="text-sm text-gray-500">Total Pesan</p>
                    <p className="text-2xl font-bold text-primary">{contacts.length}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-warning">
                    <p className="text-sm text-gray-500">Belum Dibaca</p>
                    <p className="text-2xl font-bold text-warning">{unreadCount}</p>
                </Card>
            </div>

            <div className="relative w-full sm:w-80">
                <PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Cari pesan..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <Card className="p-8 text-center text-gray-400">Memuat data...</Card>
                ) : filtered.length === 0 ? (
                    <Card className="p-8 text-center text-gray-400">Tidak ada pesan.</Card>
                ) : (
                    paginatedContacts.map((contact) => (
                        <Card
                            key={contact.id}
                            className={`p-5 cursor-pointer hover:shadow-md transition-shadow ${!contact.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                            onClick={() => handleOpen(contact)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${!contact.is_read ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                        {!contact.is_read ? <PiEnvelopeSimpleDuotone /> : <PiEnvelopeOpenDuotone />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-semibold ${!contact.is_read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>{contact.name}</p>
                                            {!contact.is_read && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{contact.subject}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-md">{contact.message}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{contact.created_at}</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {!loading && filtered.length > pageSize && (
                <div className="flex items-center justify-between">
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

            <Dialog isOpen={detailOpen} onClose={() => setDetailOpen(false)} onRequestClose={() => setDetailOpen(false)}>
                {selected && (
                    <div>
                        <h5 className="mb-4 font-bold">{selected.subject}</h5>
                        <div className="flex flex-col gap-2 text-sm mb-4">
                            <div className="flex justify-between"><span className="text-gray-500">Dari:</span><span className="font-medium">{selected.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Email:</span><span>{selected.email}</span></div>
                            {selected.phone && <div className="flex justify-between"><span className="text-gray-500">Telepon:</span><span>{selected.phone}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-500">Tanggal:</span><span>{selected.created_at}</span></div>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700 mb-4" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                        <div className="flex justify-between mt-6">
                            <Button variant="plain" color="red" size="sm" onClick={() => handleDelete(selected)}>Hapus</Button>
                            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                                <Button variant="solid" size="sm">Balas via Email</Button>
                            </a>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default KontakPage
