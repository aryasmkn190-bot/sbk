'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Avatar, Dialog, Select, Notification, toast, Pagination } from '@/components/ui'
import { PiPlusCircleDuotone, PiTrashDuotone, PiPencilDuotone, PiMagnifyingGlassDuotone, PiUserDuotone } from 'react-icons/pi'
import { getUsers, createUser, deleteUser, type UserRow } from '@/server/actions/userManagement'

const roleColors: Record<string, string> = {
    admin: 'bg-error-subtle text-error',
    editor: 'bg-info-subtle text-info',
    donor: 'bg-success-subtle text-success',
}

const UsersPage = () => {
    const [users, setUsers] = useState<UserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '', role: 'donor' })
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const loadUsers = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadUsers() }, [])

    const filtered = users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filtered.slice(start, start + pageSize)
    }, [filtered, currentPage, pageSize])

    useEffect(() => { setCurrentPage(1) }, [searchTerm])

    const handleCreate = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast.push(<Notification type="warning" title="Peringatan">Nama, email, dan password wajib diisi.</Notification>)
            return
        }
        try {
            await createUser(newUser)
            toast.push(<Notification type="success" title="Berhasil">User berhasil ditambahkan.</Notification>)
            setCreateOpen(false)
            setNewUser({ name: '', email: '', password: '', phone: '', role: 'donor' })
            loadUsers()
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Gagal menambahkan user.</Notification>)
        }
    }

    const handleDelete = async (user: UserRow) => {
        if (user.id === 'admin-001') {
            toast.push(<Notification type="warning" title="Peringatan">Admin utama tidak bisa dihapus.</Notification>)
            return
        }
        if (confirm(`Hapus user "${user.name}"?`)) {
            try {
                await deleteUser(user.id)
                toast.push(<Notification type="success" title="Berhasil">User berhasil dihapus.</Notification>)
                loadUsers()
            } catch (error) {
                toast.push(<Notification type="danger" title="Error">Gagal menghapus user.</Notification>)
            }
        }
    }

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'donor', label: 'Donor' },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 sm:w-64">
                    <PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Cari user..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button variant="solid" icon={<PiPlusCircleDuotone />} onClick={() => setCreateOpen(true)}>Tambah User</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Memuat data...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500">User</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Telepon</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Role</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Bergabung</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar size={36} icon={<PiUserDuotone />} />
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{user.phone || '-'}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role]}`}>{user.role}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-success-subtle text-success' : 'bg-gray-100 text-gray-500'}`}>
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{user.created_at}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button size="xs" variant="plain" icon={<PiPencilDuotone className="text-lg" />} />
                                                <Button size="xs" variant="plain" icon={<PiTrashDuotone className="text-lg text-error" />} onClick={() => handleDelete(user)} />
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

            <Dialog isOpen={createOpen} onClose={() => setCreateOpen(false)} onRequestClose={() => setCreateOpen(false)}>
                <h5 className="mb-4 font-bold">Tambah User Baru</h5>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama *</label>
                        <Input placeholder="Nama lengkap" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <Input type="email" placeholder="email@example.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password *</label>
                        <Input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Telepon</label>
                        <Input placeholder="08xxxxxxxxxx" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <Select options={roleOptions} defaultValue={roleOptions[2]} onChange={(option) => setNewUser({ ...newUser, role: (option as { value: string })?.value || 'donor' })} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="plain" onClick={() => setCreateOpen(false)}>Batal</Button>
                    <Button variant="solid" onClick={handleCreate}>Simpan</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default UsersPage
